import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { add, isThisMonth, sub } from 'date-fns';
import { I18nService } from 'src/app/i18n.service';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-work-month-header',
  templateUrl: './work-month-header.component.html',
  styleUrl: './work-month-header.component.scss'
})
export class WorkMonthHeaderComponent implements OnChanges {

  @Input({ required: true }) busy: boolean = false;
  @Input({ required: true }) selectedMonth?: Date;

  icons = environment.icons;
  isThisMonth = signal<boolean>(false);
  currentMonth = signal<Date>(new Date());
  lastMonth = signal<Date | undefined>(undefined);
  nextMonth = signal<Date | undefined>(undefined);

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] && changes['selectedMonth'].currentValue) {
      this.lastMonth.set(sub(changes['selectedMonth'].currentValue, { months: 1 }));
      this.nextMonth.set(add(changes['selectedMonth'].currentValue, { months: 1 }));
      this.isThisMonth.set(isThisMonth(changes['selectedMonth'].currentValue));
    }
  }

}
