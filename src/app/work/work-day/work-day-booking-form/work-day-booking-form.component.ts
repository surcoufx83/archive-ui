import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { I18nService } from 'src/app/i18n.service';
import { RecentBooking, UserSettings, WorkCustomer, WorkDayBooking, WorkProject, WorkTimeCategory } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

export const WorkDayBookingTimeValidationPattern = /^(\d{1,2}):?(\d{2})$/;

@Component({
  selector: 'app-work-day-booking-form',
  templateUrl: './work-day-booking-form.component.html',
  styleUrl: './work-day-booking-form.component.scss'
})
export class WorkDayBookingFormComponent implements OnChanges {

  @Input({ required: true }) booking!: WorkDayBooking;
  @Input({ required: true }) busy!: boolean;
  @Input({ required: true }) categories!: WorkTimeCategory[];
  @Input({ required: true }) copyBooking?: [RecentBooking | WorkDayBooking | null, number];
  @Input({ required: true }) customers!: WorkCustomer[];
  @Input({ required: true }) projects!: WorkProject[];
  @Input({ required: true }) recentBookings!: RecentBooking[];
  @Input({ required: true }) usersettingsObj!: UserSettings;
  @Output() bookingSubmit = new EventEmitter<WorkDayBooking>();
  @ViewChild('focusInput') focusElement?: ElementRef;

  editableBooking?: WorkDayBooking;

  bookingForm = new FormGroup({
    timeFrom: new FormControl<string>('', { validators: [Validators.required, Validators.pattern(WorkDayBookingTimeValidationPattern)] }),
    timeUntil: new FormControl<string>('', { validators: [Validators.required, Validators.pattern(WorkDayBookingTimeValidationPattern)] }),
    timeBreak: new FormControl<number>(0, { validators: [Validators.min(0), Validators.max(1440)] }),
    durationOutput: new FormControl<string>(''),
    category: new FormControl<number>(-1, { validators: [Validators.min(0), Validators.required] }),
    customer: new FormControl<number>(-1, { validators: [Validators.min(0), Validators.required] }),
    customerProject: new FormControl<number>(-1),
    task: new FormControl<string>(''),
    description: new FormControl<string>(''),
  });

  filterDebounce: any;
  filteredRecentBookings = signal<ModifiedRecentBooking[]>([]);
  filterRecent: string = '';
  icons = environment.icons;
  modifiedRecentBookings = signal<ModifiedRecentBooking[]>([]);

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private cache: SettingsService,
    private scroller: ViewportScroller,
  ) { }

  /**
   * Copies data from a recent booking into the booking form.
   * @param item The recent booking item to copy from.
   */
  copyFromRecent(item: RecentBooking | WorkDayBooking): void {
    this.bookingForm.patchValue({
      category: +item.timecategoryid,
      customer: item.customerid ? +item.customerid : -1,
      customerProject: item.projectid ? +item.projectid : -1,
      task: item.projectstage,
      description: item.description,
    });
    this.scroller.scrollToAnchor('scroll-anchor');
    this.focusElement?.nativeElement.focus();
  }

  /**
   * Formats a date using the FormatService.
   * @see FormatService 
   * @param date The date to format.
   * @param form The format string.
   * @returns The formatted date string.
   */
  fdate(date: Date | string | null | undefined, form: string): string {
    if (!date)
      return '';
    return this.formatService.fdate(date, form);
  }

  /**
   * Translates a given key using the i18n service.
   * @param key The key to translate.
   * @param params Additional parameters for translation.
   * @returns The translated string.
   */
  i18n(key: string, params: any[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes The changes to the data-bound properties.
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['booking']) {
      this.bookingForm.reset();
      this.focusElement?.nativeElement.focus();
    }

    if (changes['copyBooking'] && changes['copyBooking'].currentValue[0] !== null)
      this.copyFromRecent(changes['copyBooking'].currentValue[0]);

    if (changes['recentBookings'] && changes['recentBookings'].currentValue) {
      let temp: ModifiedRecentBooking[] = [];
      (<RecentBooking[]>changes['recentBookings'].currentValue).forEach((booking) => {
        temp.push({
          booking: booking,
          category: this.cache.getWorkTimeCategory(booking.timecategoryid),
          customer: this.cache.getWorkCustomer(booking.customerid),
          project: this.cache.getWorkProject(booking.projectid),
        });
      });
      this.modifiedRecentBookings.set(temp);
      this.onChangeRecentFilter();
    }

  }

  /**
   * Handles changes to the recent bookings filter.
   * Applies a debounce to prevent excessive filtering.
   */
  onChangeRecentFilter(): void {
    clearTimeout(this.filterDebounce);
    this.filterDebounce = setTimeout(() => {
      if (this.filterRecent === '')
        this.filteredRecentBookings.set(this.modifiedRecentBookings());
      else
        this.filteredRecentBookings.set(this.modifiedRecentBookings().filter((b) => `${b.customer?.name}${b.project?.name}${b.booking.description}${b.booking.projectstage}`.toLocaleLowerCase().includes(this.filterRecent.toLocaleLowerCase())))
    }, 100);
  }

  /**
   * Handles changes to the booking times.
   */
  onChangeTime(): void {
    // TODO Implementation goes here
  }

  /**
   * Handles keydown events for the filter input.
   * @param event The keyboard event.
   */
  onFilterKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.filterRecent = '';
      this.onChangeRecentFilter();
    }
  }

  /**
   * Handles form submission.
   * Emits the booking data if the form is valid.
   */
  onSubmit(): void {
    if (!this.bookingForm.valid)
      return;
    let tempBooking = { ...this.booking };
    tempBooking.break = this.bookingForm.controls.timeBreak.value || 0;
    tempBooking.customerid = this.bookingForm.controls.customer.value;
    tempBooking.description = this.bookingForm.controls.description.value || '';
    tempBooking.projectid = this.bookingForm.controls.customerProject.value;
    tempBooking.projectstage = this.bookingForm.controls.task.value || '';
    tempBooking.timecategoryid = this.bookingForm.controls.category.value || -1;
    tempBooking.timefrom = this.bookingForm.controls.timeFrom.value || '';
    tempBooking.timeuntil = this.bookingForm.controls.timeUntil.value || '';
    this.bookingSubmit.emit(tempBooking);
  }

}

type ModifiedRecentBooking = {
  booking: RecentBooking,
  category: WorkTimeCategory | null,
  customer: WorkCustomer | null,
  project: WorkProject | null,
}
