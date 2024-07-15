import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { WorkTravel } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-work-travel',
  templateUrl: './work-travel.component.html',
  styleUrl: './work-travel.component.scss'
})
export class WorkTravelComponent implements OnDestroy, OnInit {

  icons = environment.icons;
  saving: boolean = false;
  travels: WorkTravel[] = [];
  private subs: Subscription[] = [];

  constructor(
    private dataService: SettingsService,
    private formatService: FormatService,
    private i18nService: I18nService,
  ) {
    this.i18nService.setTitle('travel.pagetitle');
  }

  /**
   * Formats a date using the FormatService.
   * @see FormatService 
   * @param date The date to format.
   * @param form The format string.
   * @returns The formatted date string.
   */
  fdate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

  /**
   * Formats a URL using the FormatService.
   * @see FormatService 
   * @param inputStr The URL to format.
   * @returns The formatted URL string.
   */
  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from all subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Subscribes to work travel data and sorts it by end time in descending order.
   */
  ngOnInit(): void {
    this.subs.push(this.dataService.workTravel$.subscribe((travels) => {
      this.travels = Object.values(travels).sort((a, b) => a.timeEnd.localeCompare(b.timeEnd)).reverse();
    }));
  }

}
