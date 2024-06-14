import { Component } from '@angular/core';
import { getMonth, getYear } from 'date-fns';
import { environment } from 'src/environments/environment.dev';
import { NavbarItem } from '../config.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent {

  navitems: NavbarItem[] = [];

  constructor(
    private i18nService: I18nService
  ) {
    let tempar = [...environment.navigation.financeBarItems];
    if (getMonth(Date.now()) < 9)
      tempar.push({ "title": "navbar.finance.taxYear", params: [`${getYear(Date.now()) - 1}`], "icon": "taxes", "link": `/finance/taxes/${getYear(Date.now()) - 1}` });
    tempar.push({ "title": "navbar.finance.taxYear", params: [`${getYear(Date.now())}`], "icon": "taxes", "link": `/finance/taxes/${getYear(Date.now())}` });
    this.navitems = tempar;
    this.i18nService.setTitle('finance.pagetitle');
  }

  i18n(key: string, params: any[] = [], i: number = 0): string {
    return this.i18nService.i18n(key, params, i);
  }

}
