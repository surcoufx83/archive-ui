import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { differenceInMinutes, parseISO, set } from 'date-fns';
import { I18nService } from 'src/app/i18n.service';
import { RecentBooking, UserSettings, WorkCustomer, WorkDay, WorkDayBooking, WorkProject, WorkTimeCategory } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

export const WorkDayBookingTimeValidationPattern = /^(?<hr>\d{1,2}):?(?<min>\d{2})$/;

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
  @Input({ required: true }) day!: WorkDay;
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
    let start = this.parseTime(this.bookingForm.controls.timeFrom.value || '');
    let end = this.parseTime(this.bookingForm.controls.timeUntil.value || '');
    let breakmin = this.bookingForm.controls.timeBreak.value || 0;

    if (start && end) {
      let dif = differenceInMinutes(end, start);
      if (dif > 0) {
        dif = (dif - breakmin) / 60;
        this.bookingForm.patchValue({
          durationOutput: `${dif}`
        });
        return;
      }
    }
    this.bookingForm.patchValue({
      durationOutput: `0`
    });
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

  keyupDebounce?: number;
  /**
   * Handles the `keyup` event for time input fields.
   * Debounces the input to prevent excessive processing and validates the entered time.
   * If the input is valid and meets specific conditions, it moves the focus to the next input field.
   * 
   * @param e The current input element.
   * @param event The keyboard event triggered by the user.
   * @param next The next input element to focus on if conditions are met.
   */
  onTimeKeyUp(e: HTMLInputElement, event: KeyboardEvent, next: HTMLInputElement): void {
    clearTimeout(this.keyupDebounce);
    this.keyupDebounce = setTimeout(() => {
      const time = this.parseTime(e.value);
      const reqkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (e.value.length < 3 || time === null || !reqkeys.includes(event.key))
        return;
      if ((e.value.length === 3 && time.getHours() > 2 && time.getHours() < 10) || (e.value.length === 4)) {
        next.focus();
      }
    }, 150);
  }

  /**
   * Handles the `keyup` event for a break input field, implementing a debounce mechanism
   * to process the input after a short delay. If the input meets certain conditions,
   * it focuses on the next text area element.
   *
   * @param e - The HTML input element where the keyup event occurred.
   * @param event - The keyboard event triggered by the keyup action.
   * @param next - The next HTML text area element to focus on if conditions are met.
   * 
   * @remarks
   * - The method uses a debounce mechanism with a delay of 150ms to avoid processing
   *   the input on every key press.
   * - It checks if the input value has at least two characters and if the pressed key
   *   is a numeric character before proceeding.
   * - If the conditions are satisfied, the focus is shifted to the `next` text area element.
   */
  onBreakKeyUp(e: HTMLInputElement, event: KeyboardEvent, next: HTMLTextAreaElement): void {
    clearTimeout(this.keyupDebounce);
    this.keyupDebounce = setTimeout(() => {
      const time = +e.value;
      const reqkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (e.value.length < 2 || !reqkeys.includes(event.key))
        return;
      next.focus();
    }, 150);
  }

  /**
   * Parses a time string and returns a Date object with the time set to the parsed hours and minutes.
   * The date portion of the returned Date object is based on the `this.day.date` property.
   * 
   * @param time - A string representing the time to parse, expected to match the `WorkDayBookingTimeValidationPattern`.
   * @returns A `Date` object with the parsed time set, or `null` if the input string does not match the expected pattern.
   */
  parseTime(time: string): Date | null {
    let match = time.match(WorkDayBookingTimeValidationPattern);
    if (match && match.groups) {
      return set(parseISO(this.day.date), { hours: +match.groups['hr'], minutes: +match.groups['min'], seconds: 0 });
    }
    return null;
  }

}

type ModifiedRecentBooking = {
  booking: RecentBooking,
  category: WorkTimeCategory | null,
  customer: WorkCustomer | null,
  project: WorkProject | null,
}
