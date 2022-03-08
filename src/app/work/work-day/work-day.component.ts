import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInMinutes, format, set } from 'date-fns';
import { AuthService } from '../../auth.service';
import { SettingsService } from '../../user/settings/settings.service';

import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { Settings } from '../../user/settings/settings';
import { WorkDay, WorkDayBooking, WorkProperties, WorkTimeCategory } from '../work';

@Component({
  selector: 'app-work-day',
  templateUrl: './work-day.component.html',
  styleUrls: ['./work-day.component.scss']
})
export class WorkDayComponent implements OnInit {

  booking?: WorkDayBooking;
  busy: boolean = false;
  day?: WorkDay;
  timepattern: RegExp = /^(?<hr>\d{1,2}):?(?<min>\d{2})$/;
  today: Date = new Date();
  usersettingsObj?: Settings;
  workprops?: WorkProperties;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
      console.log(settings);
    });
    this.userSettings.workprops$.subscribe((props) => {
      this.workprops = props;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date, form: string): string {
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fd(duration: number): string {
    return this.i18n('calendar.duration.short', [duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 })]);
  }

  i18n(key: string, params: string[] = []) : string {
    return this.i18nService.i18n(key, params);
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  newBooking(dayid: number|null): void {
    this.booking = {
      break: 0,
      customer: null,
      customerid: null,
      dayid: dayid ?? -1,
      description: '',
      duration: 0,
      id: -1,
      project: null,
      projectid: null,
      projectstage: '',
      timecategory: <WorkTimeCategory>{},
      timecategoryid: -1,
      timefrom: '',
      timeuntil: ''
    };
  }

  ngOnInit(): void {
    this.busy = true;
    let url = this.config.api.baseUrl + '/work/2022-03-01';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload) {
        this.day = <WorkDay>reply.payload['day'];
        this.newBooking(this.day.id);
        console.log(this.day);
      }
      this.busy = false;
    });
  }

  onChangeTime() : void {
    if (!this.booking)
      return;
    let start = this.parseTime(this.booking.timefrom);
    let end = this.parseTime(this.booking.timeuntil);
    let breakmin = this.booking.break;

    if (start && end) {
      let dif = differenceInMinutes(end, start);
      if (dif > 0) {
        dif = (dif - breakmin) / 60;
        this.booking.duration = dif;
        return;
      }
    }
    this.booking.duration = 0;
  }

  parseTime(time: string) : Date|null {
    let match = time.match(this.timepattern);
    if (match && match.groups) {
      return set(this.today, { hours: +match.groups['hr'], minutes: +match.groups['min'], seconds: 0});
    }
    return null;
  }

  get progressdone(): string {
    if (!this.usersettingsObj || !this.day || !this.day.stats)
      return '0';
    if (this.day.stats.duration > this.usersettingsObj.work.worktime.default)
      return '' + Math.floor(this.usersettingsObj.work.worktime.default * 10);
    return '' + Math.floor(this.day.stats.duration * 10);
  }

  get progressmissing(): string {
    if (!this.usersettingsObj || !this.day || !this.day.stats)
      return '0';
    if (this.day.stats.duration > this.usersettingsObj.work.worktime.default)
      return '0';
    return '' + Math.floor((this.usersettingsObj.work.worktime.default - this.day.stats.duration) * 10);
  }

  get progressovertime(): string {
    if (!this.usersettingsObj || !this.day || !this.day.stats)
      return '0';
    if (this.day.stats.duration > this.usersettingsObj.work.worktime.default)
      return '' + Math.floor((this.day.stats.duration - this.usersettingsObj.work.worktime.default) * 10);
    return '0';
  }

  pushUserSettings(): void {
    this.userSettings.updateSettings(<Settings>this.usersettingsObj, true);
  }

  s2d(datestr: string): Date {
    return new Date(datestr);
  }

}
