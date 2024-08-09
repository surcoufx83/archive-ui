import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { UserSettings, WorkDay } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { GridRowItem } from 'src/app/utils/grid-row/grid-row.component';

@Component({
  selector: 'app-work-month-box-day',
  templateUrl: './work-month-box-day.component.html',
  styleUrl: './work-month-box-day.component.scss'
})
export class WorkMonthBoxDayComponent implements OnChanges {

  @Input({ required: true }) workDay?: WorkDay;
  @Input() settings: UserSettings | null = null;

  headerGridRow = signal<GridRowItem[]>([]);
  contentGridRow = signal<GridRowItem[]>([]);

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
  ) { }

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

  formatTimespan(duration: number | null | undefined): string {
    return this.formatService.timespan(duration);
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
    if (changes['workDay']?.currentValue.daytimeStats) {
      console.log(changes['workDay']?.currentValue.daytimeStats)
      this.headerGridRow.set([
        { content: this.i18nstr.workday.tracking.common.from },
        { content: this.i18nstr.workday.tracking.common.until },
        { content: this.i18nstr.workday.tracking.common.breakShort },
        { content: this.i18nstr.workday.tracking.common.durationShort },
      ]);
      this.contentGridRow.set([
        { content: this.fdate(changes['workDay']?.currentValue.daytimeStats.startOfDay, 'p') },
        { content: this.fdate(changes['workDay']?.currentValue.daytimeStats.endOfDay, 'p') },
        { content: this.formatTimespan(changes['workDay']?.currentValue.daytimeStats.breaksDuration) },
        { content: this.formatTimespan(changes['workDay']?.currentValue.daytimeStats.totalDurationWithBreaks) },
      ]);
    }
  }

}
