import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { UserSettings, WorkDay } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-work-day-infobox1',
  templateUrl: './work-day-infobox1.component.html',
  styleUrl: './work-day-infobox1.component.scss'
})
export class WorkDayInfobox1Component implements OnChanges {

  @Input({ required: true }) day!: WorkDay;
  @Input({ required: true }) today!: Date;
  @Input({ required: true }) usersettingsObj!: UserSettings;

  icons = environment.icons;
  progressDone = signal<number>(0);
  progressMissing = signal<number>(0);
  progressOvertime = signal<number>(0);

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

  i18nDuration(duration: number): string {
    return this.i18n('calendar.duration.short', [duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 })]);
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
    if (changes['usersettingsObj'] || changes['day']) {
      this.calculateProgressBarItems();
    }
  }

  /**
   * Calculates the progress bar items based on the day's stats and user settings.
   */
  calculateProgressBarItems(): void {
    if (!this.day.stats) {
      this.setProgress({
        done: 0, missing: 0, overtime: 0
      });
      return;
    }
    if (this.day.stats.duration > this.usersettingsObj.work.worktime.default) {
      this.setProgress({
        done: Math.floor(this.usersettingsObj.work.worktime.default * 10),
        missing: 0,
        overtime: Math.floor((this.day.stats.duration - this.usersettingsObj.work.worktime.default) * 10),
      });
    }
    else {
      this.setProgress({
        done: Math.floor(this.day.stats.duration * 10),
        missing: Math.floor((this.usersettingsObj.work.worktime.default - this.day.stats.duration) * 10),
        overtime: 0,
      });
    }
  }

  /**
   * Sets the progress bar values.
   * @param values The progress values to set.
   */
  setProgress(values: ProgressItems): void {
    this.progressDone.set(values.done);
    this.progressMissing.set(values.missing);
    this.progressOvertime.set(values.overtime);
  }

}

type ProgressItems = {
  done: number,
  missing: number,
  overtime: number,
}