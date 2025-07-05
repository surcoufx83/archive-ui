import { Component, Input } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-work-day-header',
  templateUrl: './work-day-header.component.html',
  styleUrl: './work-day-header.component.scss'
})
export class WorkDayHeaderComponent {

  @Input({ required: true }) actualDate!: string;
  @Input({ required: true }) busy!: boolean;
  @Input({ required: true }) isToday!: boolean;
  @Input({ required: true }) today?: Date;
  @Input({ required: true }) tomorrow?: Date;
  @Input({ required: true }) yesterday?: Date;

  icons = environment.icons;

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

}
