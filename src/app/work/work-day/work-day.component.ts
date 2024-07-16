import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addDays, differenceInMinutes, format, parseISO, set, setHours, subDays } from 'date-fns';
import { AuthService } from '../../auth.service';
import { SettingsService } from '../../utils/settings.service';

import { ViewportScroller } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { RecentBooking, UserSettings, WorkCustomer, WorkDay, WorkDayBooking, WorkProject, WorkTimeCategory } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { I18nService } from '../../i18n.service';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'app-work-day',
  templateUrl: './work-day.component.html',
  styleUrls: ['./work-day.component.scss']
})
export class WorkDayComponent implements OnDestroy, OnInit {

  @ViewChild('createCustomerModalCloser') createCustomerModalCloserElement?: ElementRef;
  @ViewChild('focus') focusElement?: ElementRef;

  actualDate: string = this.formatService.fdate(new Date(), 'yyyy-MM-dd');
  booking?: WorkDayBooking;
  bookingProps: { [key: string]: number } = {};
  busy: boolean = false;
  categories: WorkTimeCategory[] = [];
  createCustomer = new UntypedFormGroup({
    'name': new UntypedFormControl('', { validators: Validators.required }),
    'busy': new UntypedFormControl(false)
  });
  copyBooking = signal<[RecentBooking | WorkDayBooking | null, number]>([null, 0]);
  customers: WorkCustomer[] = [];
  day?: WorkDay;
  icons = environment.icons;
  isToday: boolean = true;
  livetrackingActive: boolean = false;
  projects: WorkProject[] = [];
  recentEntries = signal<RecentBooking[]>([]);
  subscriptions: Subscription[] = [];
  timepattern: RegExp = /^(?<hr>\d{1,2}):?(?<min>\d{2})$/;
  today: Date = new Date();
  tomorrow?: Date;
  usersettingsObj: UserSettings | null = null;
  yesterday?: Date;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private formatService: FormatService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService,
    private scroller: ViewportScroller
  ) { }

  get bookings(): WorkDayBooking[] {
    if (!this.day || this.day.bookings == null)
      return [];
    return Object.values(this.day.bookings);
  }

  /* category(id: number): WorkTimeCategory | undefined {
    return this.userSettings.getWorkTimeCategory(id) ?? undefined;
  } */

  copyFromRecent(item: RecentBooking | WorkDayBooking): void {
    this.copyBooking.set([item, Date.now()])
    /* this.bookingProps = {};
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
    this.focusElement?.nativeElement.focus(); */
  }

  /* customer(id: number): WorkCustomer | undefined {
    return this.userSettings.getWorkCustomer(id) ?? undefined;
  } */

  deleteBooking(item: WorkDayBooking): void {
    let url = `${environment.api.baseUrl}/work/bookings/${item.id}/delete`;
    this.authService.updateApi(url, {}).pipe(first()).subscribe((reply) => {
      if (reply.payload && reply.payload['day'])
        this.day = <WorkDay>reply.payload['day'];
      if (this.focusElement != undefined)
        this.focusElement.nativeElement.focus();
    });
  }

  /* f(date: Date | string, form: string): string {
    if (typeof (date) === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fd(duration: number): string {
    return this.i18n('calendar.duration.short', [duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 })]);
  } */

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /* get liveButtonColor(): string {
    if (!this.usersettingsObj?.work.livetracking.enabled)
      return 'btn-secondary';
    if (!this.livetrackingActive)
      return 'btn-primary';
    return 'btn-success';
  } */

  /* get locale(): string {
    return this.i18nService.Locale;
  } */

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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }


  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.workTimeCategories$.pipe(first()).subscribe((categories) => {
      // Only used once so form field won't get resettet by updating categories
      this.categories = Object.values(categories)
        .sort((a, b) => this.i18n('work.timecategories.' + a.name).localeCompare(this.i18n('work.timecategories.' + b.name)))
    }));
    this.subscriptions.push(this.userSettings.workCustomers$.subscribe((customers) => {
      this.customers = Object.values(customers).sort((a, b) => a.name.localeCompare(b.name));
    }));
    this.subscriptions.push(this.userSettings.workRecentTimeBookings$.subscribe((bookings) => this.recentEntries.set(bookings)));
    this.subscriptions.push(this.route.paramMap.subscribe((params) => {
      let date = 'today';
      if (!params.has('date')) {
        this.router.navigate(['/work', 'day', this.actualDate]);
        return;
      }
      date = params.get('date') ?? '';
      this.busy = true;
      let url = `${environment.api.baseUrl}/work/${date}`;
      this.authService.queryApi(url).subscribe((reply) => {
        if (reply.success && reply.payload) {
          this.day = <WorkDay>reply.payload['day'];
          this.newBooking(this.day.id);
          this.today = setHours(parseISO(this.day.date), 12);
          this.i18nService.setTitle('workday.pagetitle', [this.formatService.fdate(this.today, 'PP')]);
          this.isToday = (this.formatService.fdate(this.today, 'yyyy-MM-dd') == this.actualDate);
          this.yesterday = subDays(this.today, 1);
          this.tomorrow = addDays(this.today, 1);
        }
        this.busy = false;
      });
    }));
    //setTimeout(() => { this.refreshRecentBookings(); }, 10);
  }

  /* onChangeCategory(): void {
    if (!this.booking)
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
    if (!this.booking)
      return;
    if (this.bookingProps['customer'] == -1) {
      this.booking.customer = null;
      this.booking.customerid = -1;
      return;
    }
    this.booking.customer = this.customers[this.bookingProps['customer']];
    this.booking.customerid = this.customers[this.bookingProps['customer']].id;
    this.projects = this.userSettings.getWorkProjects(this.booking.customerid) ?? [];
  }

  onChangeProject(): void {
    if (!this.booking)
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
  } */

  onSaveCreateCustomer(): void {
    if (this.createCustomer.get('busy')?.value)
      return;
    this.createCustomer.patchValue({ 'busy': true });
    let newcustomer: WorkCustomer = {
      id: 0, name: this.createCustomer.get('name')!.value, created: "", deleted: null,
      disabled: false, lastusage: "", modified: "", userid: 0
    }
    this.userSettings.updateCustomer(newcustomer).pipe(first()).subscribe((customer) => {
      if (customer != null) {
        this.createCustomerModalCloserElement?.nativeElement.click();
        this.createCustomer.get('name')!.reset();
      }
      this.createCustomer.patchValue({ 'busy': false });
    });
  }

  onSubmitBooking(booking: WorkDayBooking): void {
    if (this.busy || !this.day)
      return;
    this.busy = true;
    let url = `${environment.api.baseUrl}/work/month/${this.day.monthid}/day/${this.day.day}/booking/create`;
    this.authService.updateApi(url, booking).pipe(first()).subscribe((reply) => {
      if (reply.success) {
        this.newBooking(this.day?.id);
        if (reply.payload && reply.payload['day'])
          this.day = <WorkDay>reply.payload['day'];
      }
      this.busy = false;
    });
  }

  /* parseTime(time: string): Date | null {
    let match = time.match(this.timepattern);
    if (match && match.groups) {
      return set(this.today, { hours: +match.groups['hr'], minutes: +match.groups['min'], seconds: 0 });
    }
    return null;
  } */

  /* project(id: number): WorkProject | undefined {
    return this.userSettings.getWorkProject(id) ?? undefined;
  } */

  /* pushUserSettings(): void {
    this.userSettings.updateSettings(<UserSettings>this.usersettingsObj, true);
  } */

  /* refreshRecentBookings(): void {
    this.authService.queryApi(`${environment.api.baseUrl}/work/bookings/recent`).pipe(first()).subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['items'])
        this.recentEntries = <RecentBooking[]>reply.payload['items'];
      setTimeout(() => { this.refreshRecentBookings(); }, 60000);
    });
  } */

  /* s2d(datestr: string): Date {
    return new Date(datestr);
  } */

}
