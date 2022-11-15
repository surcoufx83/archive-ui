import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInMinutes, format, parseISO, set } from 'date-fns';
import { AuthService } from '../../auth.service';
import { SettingsService } from '../../user/settings/settings.service';

import { ViewportScroller } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RecentBooking, UserSettings, WorkCustomer, WorkDay, WorkDayBooking, WorkProject, WorkProperties, WorkTimeCategory } from 'src/app/if';
import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-work-day',
  templateUrl: './work-day.component.html',
  styleUrls: ['./work-day.component.scss']
})
export class WorkDayComponent implements OnInit {

  @ViewChild('focus') focusElement?: ElementRef;
  @ViewChild('createCustomerModalCloser') createCustomerModalCloserElement?: ElementRef;

  booking?: WorkDayBooking;
  bookingProps: { [key: string]: number } = {};
  busy: boolean = false;
  categories: WorkTimeCategory[] = [];
  customers: WorkCustomer[] = [];
  day?: WorkDay;
  livetrackingActive: boolean = false;
  projects: WorkProject[] = [];
  recentEntries: RecentBooking[] = [];
  timepattern: RegExp = /^(?<hr>\d{1,2}):?(?<min>\d{2})$/;
  today: Date = new Date();
  usersettingsObj: UserSettings | null = null;
  workprops: WorkProperties | null = null;

  createCustomer = new UntypedFormGroup({
    'name': new UntypedFormControl('', { validators: Validators.required }),
    'busy': new UntypedFormControl(false)
  });

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService,
    private scroller: ViewportScroller) {
    this.userSettings.loadWorkEntities();
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.workprops$.subscribe((props) => {
      if (props != null) {
        this.workprops = props;
        this.categories = props.timeCategories.sort((a, b) => this.i18n('work.timecategories.' + a.name) > this.i18n('work.timecategories.' + b.name) ? 1 : this.i18n('work.timecategories.' + a.name) === this.i18n('work.timecategories.' + b.name) ? 0 : -1);
      }
    });
    this.userSettings.customers$.subscribe((customers) => {
      this.customers = Object.values(customers).sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
    });
    setTimeout(() => { this.refreshRecentBookings(); }, 1000);
  }

  get bookings(): WorkDayBooking[] {
    if (!this.day)
      return [];
    return Object.values(this.day.bookings);
  }

  category(id: number): WorkTimeCategory | undefined {
    return this.workprops?.timeCategories.find(e => e.id == id);
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  copyFromRecent(item: RecentBooking | WorkDayBooking): void {
    this.bookingProps = {};
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == item.timecategoryid) {
        this.bookingProps['timecategory'] = i;
        this.onChangeCategory();
      }
    }
    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].id == item.customerid) {
        this.bookingProps['customer'] = i;
        this.onChangeCustomer();
      }
    }
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].id == item.projectid) {
        this.bookingProps['project'] = i;
        this.onChangeProject();
      }
    }
    if (this.booking) {
      this.booking.projectstage = item.projectstage;
      this.booking.description = item.description;
    }
    this.scroller.scrollToAnchor('scroll-anchor');
    this.focusElement?.nativeElement.focus();
  }

  customer(id: number): WorkCustomer | undefined {
    return this.workprops?.customers.find(e => e.id == id);
  }

  deleteBooking(item: WorkDayBooking): void {
    let url = this.config.api.baseUrl + '/work/bookings/' + item.id + '/delete';
    this.authService.updateApi(url, {}).subscribe((reply) => {
      if (reply.payload && reply.payload['day'])
        this.day = <WorkDay>reply.payload['day'];
      if (this.focusElement != undefined)
        this.focusElement.nativeElement.focus();
    });
  }

  f(date: Date | string, form: string): string {
    if (typeof (date) === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fd(duration: number): string {
    return this.i18n('calendar.duration.short', [duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 })]);
  }

  get hasBookings(): boolean {
    if (!this.day)
      return false;
    return Object.keys(this.day.bookings).length > 0;
  }

  i18n(key: string, params: string[] = []): string {
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

  newBooking(dayid: number | undefined): void {
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
    this.route.paramMap.subscribe((params) => {
      let date = 'today';
      if (params.has('date'))
        date = params.get('date') ?? '';
      this.busy = true;
      let url = this.config.api.baseUrl + '/work/' + date;
      this.authService.queryApi(url).subscribe((reply) => {
        if (reply.success && reply.payload) {
          this.day = <WorkDay>reply.payload['day'];
          this.newBooking(this.day.id);
          this.today = parseISO(this.day.date);
        }
        this.busy = false;
      });
    });
  }

  onChangeCategory(): void {
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

  onChangeCustomer(): void {
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

  onChangeProject(): void {
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

  onChangeTime(): void {
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

  onSaveCreateCustomer(): void {
    if (this.createCustomer.get('busy')?.value)
      return;
    this.createCustomer.patchValue({ 'busy': true });
    let newcustomer: WorkCustomer = {
      id: 0, name: this.createCustomer.get('name')!.value, created: "", deleted: null,
      disabled: false, lastusage: "", modified: "", userid: 0
    }
    this.userSettings.updateCustomer(newcustomer).subscribe((customer) => {
      if (customer != null) {
        this.createCustomerModalCloserElement?.nativeElement.click();
        this.createCustomer.get('name')!.reset();
      }
      this.createCustomer.patchValue({ 'busy': false });
    });
  }

  onSubmitBooking(): void {
    if (this.busy || !this.day)
      return;
    this.busy = true;
    let url = this.config.api.baseUrl + '/work/month/' + this.day.monthid + '/day/' + this.day.day + '/booking/create';
    this.authService.updateApi(url, this.booking).subscribe((reply) => {
      if (reply.success) {
        this.newBooking(this.day?.id);
        if (reply.payload && reply.payload['day'])
          this.day = <WorkDay>reply.payload['day'];
        if (this.focusElement != undefined)
          this.focusElement.nativeElement.focus();
      }
      this.busy = false;
    });
  }

  parseTime(time: string): Date | null {
    let match = time.match(this.timepattern);
    if (match && match.groups) {
      return set(this.today, { hours: +match.groups['hr'], minutes: +match.groups['min'], seconds: 0 });
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

  project(id: number): WorkProject | undefined {
    return this.workprops?.projects.find(e => e.id == id);
  }

  pushUserSettings(): void {
    this.userSettings.updateSettings(<UserSettings>this.usersettingsObj, true);
  }

  refreshRecentBookings(): void {
    this.authService.queryApi(this.config.api.baseUrl + '/work/bookings/recent').subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['items'])
        this.recentEntries = <RecentBooking[]>reply.payload['items'];
      setTimeout(() => { this.refreshRecentBookings(); }, 60000);
    });
  }

  s2d(datestr: string): Date {
    return new Date(datestr);
  }

}
