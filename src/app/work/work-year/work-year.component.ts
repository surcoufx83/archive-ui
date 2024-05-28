import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { add, eachWeekendOfMonth, format, formatISO, formatRFC7231, getDaysInMonth, getMonth, getYear, sub } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { UserSettings, WorkMonth } from 'src/app/if';
import { SettingsService } from 'src/app/utils/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';

@Component({
  selector: 'app-work-year',
  templateUrl: './work-year.component.html',
  styleUrls: ['./work-year.component.scss']
})
export class WorkYearComponent implements OnDestroy, OnInit {

  busy: boolean = false;
  loaded: boolean = false;
  usersettingsObj: UserSettings | null = null;
  years: number[] = [];
  yearMonths: { [key: number]: WorkMonth[] } = {};
  yearClosingTime: { [key: number]: number } = {};
  yearMonthCount: { [key: number]: number } = {};
  yearMonthsVisible: { [key: number]: boolean } = {};
  nextYear: number = 0;
  yearBackup?: WorkMonth[];

  thisYear: number;

  subs: Subscription[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService,
    private toastsService: ToastsService) {
    this.subs.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.thisYear = getYear(Date.now());
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date | string, form: string): string {
    if (typeof (date) === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fd(duration: number): string {
    return this.i18n('calendar.duration.short', [duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 })]);
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.busy = true;
    this.loaded = false;
    let url = this.config.api.baseUrl + '/work/month';
    this.authService.queryApi(url).subscribe((reply) => {
      this.yearMonths = <{ [key: number]: WorkMonth[] }>reply.payload!['years'];
      this.busy = false;
      this.loaded = true;
      Object.entries(this.yearMonths).forEach((item) => {
        item[1] = item[1].sort((a, b) => a.month - b.month);
        this.yearClosingTime[<number><unknown>item[0]] = item[1][item[1].length - 1].timeclose;
        this.yearMonthCount[<number><unknown>item[0]] = item[1].length;
        this.yearMonthsVisible[<number><unknown>item[0]] = this.yearMonthsVisible[<number><unknown>item[0]] || (item[1].length != 12) || <number><unknown>item[0] == this.thisYear;
      });
      this.years = Object.keys(this.yearMonths).sort((a, b) => +a - +b).map(x => +x);
      this.nextYear = Math.max(...this.years) + 1;
    });
  }

  onAddYear(year: number): void {
    let cancel = false;
    Object.entries(this.yearMonthCount).forEach((item) => {
      if (item[1] < 12) {
        cancel = true;
        this.toastsService.warn(
          this.i18n('workyear.addYear.yearOpenToastTitle'),
          this.i18n('workyear.addYear.yearOpenToastMessage', ['' + item[0]])
        );
      }
    });
    if (cancel)
      return;
    if (this.years.includes(year))
      return;
    this.years.push(year);
    this.yearClosingTime[year] = 0;
    this.yearMonthCount[year] = 0;
    this.yearMonthsVisible[year] = true;
    this.yearMonths[year] = [];
    this.nextYear += 1;
    this.onCompleteYear(year);
  }

  onCompleteYear(year: number): void {
    if (this.yearMonthCount[year] == undefined || this.yearMonthCount[year] == 12)
      return;
    if (this.yearBackup != undefined)
      this.yearMonths[year] = [...this.yearBackup];
    this.yearBackup = [...this.yearMonths[year]];
    let i = this.yearMonthCount[year];
    this.onCompleteYearMonth(year, i).subscribe((result) => { });
    this.yearBackup = undefined;
  }

  private onCompleteYearMonth(year: number, i: number): Subject<boolean> {
    let subject = new Subject<boolean>();
    const url = this.config.api.baseUrl + '/work/month/create';
    const datefrom = new Date(year, i, 1, 12, 0, 0);
    const dateuntil = sub(add(new Date(year, i, 1, 12, 0, 0), { months: 1 }), { days: 1 });
    let month: WorkMonth = {
      datefrom: formatISO(datefrom),
      dateuntil: formatISO(dateuntil),
      days: getDaysInMonth(datefrom),
      holidays: 0,
      id: 0,
      month: getMonth(datefrom) + 1,
      timeclose: 0,
      timedif: 0,
      timestart: 0,
      updated: '',
      userid: 0,
      weekenddays: eachWeekendOfMonth(datefrom).length,
      year: year,
      uiCreating: true
    };
    this.authService.updateApi(url, month).subscribe((reply) => {
      if (reply.success) {
        month = { ...reply.payload!['month'] };
        this.yearMonths[year].push(month);
        this.yearClosingTime[year] = month.timeclose;
        this.yearMonthCount[year] = this.yearMonths[year].length;
        if (i < 11) {
          let sub = this.onCompleteYearMonth(year, i + 1).subscribe((r) => {
            subject.next(r);
            subject.complete();
          });
        }
        else {
          subject.next(true);
          subject.complete();
        }
      }
      else {
        subject.next(false);
        subject.complete();
      }
    });
    return subject;
  }

  s2d(datestr: string): Date {
    return new Date(datestr);
  }

}
