import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addDays, differenceInMinutes, format, parseISO, set, setHours, subDays } from 'date-fns';
import { AuthService } from '../../auth.service';
import { SettingsService } from '../../utils/settings.service';

import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { RecentBooking, UserSettings, WorkCustomer, WorkDay, WorkDayBooking, WorkProject, WorkTimeCategory } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { I18nService } from '../../i18n.service';
import { FormatService } from 'src/app/utils/format.service';
import { ToastsService } from 'src/app/utils/toasts.service';

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
  createCustomer = new FormGroup({
    name: new FormControl<string>('', { validators: Validators.required }),
  });
  createCustomerBusy = signal<boolean>(false);
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
    private toastsService: ToastsService,
  ) { }

  /**
   * Retrieves the bookings for the day.
   * @returns An array of WorkDayBooking objects.
   */
  get bookings(): WorkDayBooking[] {
    if (!this.day || this.day.bookings == null)
      return [];
    return Object.values(this.day.bookings);
  }

  /**
   * After user clicks a item in the days booking list, this method is
   * invoked and by updating the `copyBooking` property, the booking
   * to copy is transfered into the form component.
   * The `Date.now()` is used also updated if user clicks the same
   * booking again.
   * @param item The booking to transfer to the form
   */
  copyFromRecent(item: RecentBooking | WorkDayBooking): void {
    this.copyBooking.set([item, Date.now()]);
  }

  /**
   * Deletes a booking.
   * @param item The booking to delete.
   */
  deleteBooking(item: WorkDayBooking): void {
    let url = `${environment.api.baseUrl}/work/bookings/${item.id}/delete`;
    this.authService.updateApi(url, {}).pipe(first()).subscribe((reply) => {
      if (reply.payload && reply.payload['day'])
        this.day = <WorkDay>reply.payload['day'];
      if (this.focusElement != undefined)
        this.focusElement.nativeElement.focus();
    });
  }

  /**
   * Translates a given key using the i18n service.
   * @param key The key to translate.
   * @param params Additional parameters for translation.
   * @returns The translated string.
   */
  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /**
   * Creates a new booking for the specified day.
   * @param dayid The ID of the day for the new booking.
   */
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

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Unsubscribes from all subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Lifecycle hook that is called once, after the first ngOnChanges().
   * Initializes the component and subscribes to various services.
   */
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
  }

  /**
   * Handles the creation of a new customer.
   * Updates the customer list and resets the form.
   */
  onSaveCreateCustomer(): void {
    if (this.createCustomerBusy() || !this.createCustomer.valid)
      return;
    this.createCustomerBusy.set(true);
    let newcustomer: WorkCustomer = {
      id: 0, name: this.createCustomer.get('name')!.value || '', created: "", deleted: null,
      disabled: false, lastusage: "", modified: "", userid: 0
    }
    let sub = this.userSettings.updateCustomer(newcustomer).subscribe((customer) => {
      if (customer == null)
        return;
      if (customer !== true && customer !== false) {
        this.createCustomerModalCloserElement?.nativeElement.click();
        this.createCustomer.get('name')!.reset();
        this.createCustomer.reset();
      }
      else {
        this.toastsService.error('Fehler', 'Der neue Kunde konnte nicht angelegt werden.');
      }
      this.createCustomerBusy.set(false);
      sub.unsubscribe();
    });
  }

  /**
   * Handles the submission of a booking.
   * Updates the booking list and resets the form.
   * @param booking The booking to submit.
   */
  onSubmitBooking(booking: WorkDayBooking): void {
    if (this.busy || !this.day)
      return;
    this.busy = true;
    let url = `${environment.api.baseUrl}/work/month/${this.day.monthid}/day/${this.day.day}/booking/create`;
    this.authService.updateApi(url, booking).pipe(first()).subscribe((reply) => {
      if (reply.success) {
        this.newBooking(this.day?.id);
        if (reply.payload?.['day'])
          this.day = <WorkDay>reply.payload['day'];
      }
      this.busy = false;
    });
  }

}
