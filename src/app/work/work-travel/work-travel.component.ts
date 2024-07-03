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

  fdate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

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

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.dataService.workTravel$.subscribe((travels) => {
      this.travels = Object.values(travels).sort((a, b) => a.timeEnd.localeCompare(b.timeEnd)).reverse();
      console.log(this.travels);
    }));
  }

}
