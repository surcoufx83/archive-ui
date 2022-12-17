import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getMonth, getYear } from 'date-fns';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService, NavbarItem } from '../config.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {

  navitems: NavbarItem[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService) {
    let tempar = Object.assign([], this.config.navbar.financeitems);
    if (getMonth(Date.now()) < 9)
      tempar.push({ "title": "navbar.finance.taxYear", params: [`${getYear(Date.now()) - 1}`], "icon": "taxes", "link": `/finance/taxes/${getYear(Date.now()) - 1}` });
    tempar.push({ "title": "navbar.finance.taxYear", params: [`${getYear(Date.now())}`], "icon": "taxes", "link": `/finance/taxes/${getYear(Date.now())}` });
    this.navitems = tempar;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: any[] = [], i: number = 0): string {
    return this.i18nService.i18n(key, params, i);
  }

  ngOnInit(): void { }

}
