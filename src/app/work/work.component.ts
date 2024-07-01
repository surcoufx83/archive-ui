import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.dev';
import { NavbarItem } from '../config.service';
import { I18nService } from '../i18n.service';
import { L10nArchiveLocale } from '../l10n/l10n.types';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {

  navitems: NavbarItem[] = environment.navigation.workBarItems;

  constructor(
    private i18nService: I18nService
  ) {
    this.i18nService.setTitle(this.i18nstr.work.pagetitle);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

}
