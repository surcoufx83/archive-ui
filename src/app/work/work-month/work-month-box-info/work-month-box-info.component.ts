import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { WorkMonth } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { CardProgress } from 'src/app/utils/card/card.component';
import { FormatService } from 'src/app/utils/format.service';
import { GridRowItem } from 'src/app/utils/grid-row/grid-row.component';

@Component({
  selector: 'app-work-month-info-box',
  templateUrl: './work-month-box-info.component.html',
  styleUrl: './work-month-box-info.component.scss'
})
export class WorkMonthBoxInfoComponent implements OnChanges {

  @Input({ required: true }) workMonth?: WorkMonth;

  headerGridRow = signal<GridRowItem[]>([]);
  contentGridRow = signal<GridRowItem[]>([]);

  progress = signal<CardProgress | undefined>(undefined);

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
  ) { }

  apply3ColGrid(month: WorkMonth) {
    this.headerGridRow.set([
      { content: this.i18nstr.workmonth.cards.time.takeover },
      { content: this.i18nstr.workmonth.cards.time.booked },
      { content: this.i18nstr.workmonth.cards.time.carryover },
    ]);
    this.contentGridRow.set([
      { content: this.getCellContent(month.stats.bookings.timeStart) },
      { content: this.getCellContent(month.stats.bookings.timeBooked) },
      { content: this.getCellContent(month.stats.bookings.timeClose) },
    ]);
  };

  apply4ColGrid(month: WorkMonth) {
    this.headerGridRow.set([
      { content: this.i18nstr.workmonth.cards.time.takeover },
      { content: this.i18nstr.workmonth.cards.time.booked },
      { content: this.i18nstr.workmonth.cards.time.target },
      { content: this.i18nstr.workmonth.cards.time.carryover },
    ]);
    this.contentGridRow.set([
      { content: this.getCellContent(month.stats.bookings.timeStart) },
      { content: this.getCellContent(month.stats.bookings.timeBooked) },
      { content: this.getCellContent(month.stats.bookings.timeTarget) },
      { content: this.getCellContent(month.stats.bookings.timeClose) },
    ]);
  };

  /**
   * Calculates the progress bar items based on the months stats and user settings.
   */
  calculateProgressBarItems(month: WorkMonth): void {
    if (month.stats.bookings.timeTarget == 0)
      return;

    if (month.stats.bookings.timeTarget > month.stats.bookings.timeBooked) {
      this.progress.set({
        max: Math.max(month.stats.bookings.timeTarget, month.stats.bookings.timeBooked),
        items: [
          { css: ['bg-success'], value: month.stats.bookings.timeBooked },
          { css: ['bg-warning'], value: month.stats.bookings.timeTarget - month.stats.bookings.timeBooked }
        ]
      });
    }
    else {
      this.progress.set({
        max: Math.max(month.stats.bookings.timeTarget, month.stats.bookings.timeBooked),
        items: [
          { css: ['bg-success'], value: month.stats.bookings.timeTarget },
          { css: ['bg-danger'], value: month.stats.bookings.timeBooked - month.stats.bookings.timeTarget }
        ]
      });
    }
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

  getCellContent(value: number): string {
    return this.i18n('calendar.duration.short', [this.formatService.fnumber(value, 1)]);
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
    if (changes['workMonth']?.currentValue) {
      if (changes['workMonth'].currentValue.stats.bookings.timeTarget > 0) {
        this.apply4ColGrid(changes['workMonth'].currentValue);
      }
      else {
        this.apply3ColGrid(changes['workMonth'].currentValue);
      }
      this.calculateProgressBarItems(changes['workMonth'].currentValue);
    }
  }

}
