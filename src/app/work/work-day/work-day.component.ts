import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInMinutes, format, set } from 'date-fns';
import { AuthService } from '../../auth.service';
import { SettingsService } from '../../user/settings/settings.service';

import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { Settings } from '../../user/settings/settings';
import { WorkCustomer, WorkDay, WorkDayBooking, WorkProject, WorkProperties, WorkTimeCategory } from '../work';

@Component({
  selector: 'app-work-day',
  templateUrl: './work-day.component.html',
  styleUrls: ['./work-day.component.scss']
})
export class WorkDayComponent implements OnInit {

  booking?: WorkDayBooking;
  bookingProps: {[key: string]: number} = {};
  busy: boolean = false;
  categories: WorkTimeCategory[] = [];
  customers: WorkCustomer[] = [];
  day?: WorkDay;
  livetrackingActive: boolean = false;
  projects: WorkProject[] = [];
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
    });
    this.userSettings.workprops$.subscribe((props) => {
      this.workprops = props;
      this.customers = props.customers.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);
      this.categories = props.timeCategories.sort((a, b) => this.i18n('work.timecategories.' + a.name) > this.i18n('work.timecategories.' + b.name) ? 1 : this.i18n('work.timecategories.' + a.name) === this.i18n('work.timecategories.' + b.name) ? 0 : -1);
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

  get liveButtonColor(): string {
    if (!this.usersettingsObj?.work.livetracking.enabled)
      return 'btn-secondary';
    if (!this.livetrackingActive)
      return 'btn-primary';
    return 'btn-success';
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  newBooking(dayid: number|null): void {
    this.booking = {
      break: 0,
      customer: null,
      customerid: -1,
      dayid: dayid ?? 0,
      description: '',
      duration: 0,
      id: 0,
      project: null,
      projectid: -1,
      projectstage: '',
      timecategory: <WorkTimeCategory>{},
      timecategoryid: -1,
      timefrom: '',
      timeuntil: ''
    };
    this.bookingProps = {};
  }

  ngOnInit(): void {
    this.busy = true;
    let url = this.config.api.baseUrl + '/work/today';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload) {
        this.day = <WorkDay>reply.payload['day'];
        this.newBooking(this.day.id);
      }
      this.busy = false;
    });
  }

  onChangeCategory() : void {
    if (!this.booking || !this.workprops)
      return;
    if (this.bookingProps['timecategory'] == -1) {
      this.booking.timecategory = <WorkTimeCategory>{};
      this.booking.timecategoryid = -1;
      return;
    }
    this.booking.timecategory = this.categories[this.bookingProps['timecategory']];
    this.booking.timecategoryid = this.categories[this.bookingProps['timecategory']].id;
  }

  onChangeCustomer() : void {
    this.projects = [];
    if (!this.booking || !this.workprops)
      return;
    if (this.bookingProps['customer'] == -1) {
      this.booking.customer = null;
      this.booking.customerid = -1;
      return;
    }
    this.booking.customer = this.customers[this.bookingProps['customer']];
    this.booking.customerid = this.customers[this.bookingProps['customer']].id;
    this.projects = this.workprops.projects.filter((e) => {
      return !e.disabled && +e.customerid === (<WorkDayBooking>this.booking).customerid;
    }).sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);
  }

  onChangeProject() : void {
    if (!this.booking || !this.workprops)
      return;
    if (this.bookingProps['project'] == -1) {
      this.booking.project = null;
      this.booking.projectid = -1;
      return;
    }
    this.booking.project = this.projects[this.bookingProps['project']];
    this.booking.projectid = this.projects[this.bookingProps['project']].id;
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

  onSubmitBooking() : void {
    console.log('onSubmitBooking', this.booking);
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
