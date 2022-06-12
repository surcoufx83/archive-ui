import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class DbManagerComponent implements OnInit {

  busy: boolean = false;
  cache: DbManagerStorage = { itemcount: {} };
  storagename: string = this.config.storage.prefix + 'dbmanagerData';
  usersettingsObj: Settings|null = null;
  when: number = 0;
  colFinished: string = ' text-success';

  items: DbManagerGroup[] = [
    {
      title: 'db.manager.files',
      items: [
        { link: '/db/classes', title: 'db.classes.title', icon: this.config.icons['class'] + this.colFinished },
        { link: '/db/cases', title: 'db.cases.title', icon: this.config.icons['cases'], children: [
          { link: '/db/cases/actions', title: 'db.cases.actions.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/cases/status', title: 'db.cases.status.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/cases/types', title: 'db.cases.types.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/cases/filetypes', title: 'db.cases.filetypes.title', icon: 'fa-solid fa-shapes' },
        ] },
        { link: '/db/extension', title: 'db.extension.title', icon: 'fa-solid fa-shapes' }
      ]
    },
    {
      title: 'db.manager.parties',
      items: [
        { link: '/db/parties', title: 'db.parties.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/parties/clients', title: 'db.parties.clients.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/parties/banks', title: 'db.parties.banks.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/parties/addresses', title: 'db.parties.addresses.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/parties/contacts', title: 'db.parties.contacts.title', icon: 'fa-solid fa-shapes', children: [
            { link: '/db/contacts/types', title: 'db.contacts.types.title', icon: 'fa-solid fa-shapes' },
          ] },
          { link: '/db/parties/roles', title: 'db.parties.roles.title', icon: 'fa-solid fa-shapes' },
        ] }
      ]
    },
    {
      title: 'db.manager.finance',
      items: [
        { link: '/db/accounts', title: 'db.accounts.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/accounts/mandates', title: 'db.accounts.mandates.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/accounts/orders', title: 'db.accounts.orders.title', icon: 'fa-solid fa-shapes' },
        ] },
        { link: '/db/currencies', title: 'db.currencies.title', icon: this.config.icons['currency'] + this.colFinished },
        { link: '/db/stocks', title: 'db.stocks.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/stocks/apis', title: 'db.stocks.apis.title', icon: 'fa-solid fa-shapes' },
        ] },
        { link: '/db/articles', title: 'db.articles.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/articles/categories', title: 'db.articles.categories.title', icon: 'fa-solid fa-shapes' },
        ] },
        { link: '/expenses', title: 'db.expenses.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/expenses/categories', title: 'db.expenses.categories.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/expenses/templates', title: 'db.expenses.templates.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/expenses/types', title: 'db.expenses.types.title', icon: 'fa-solid fa-shapes' },
        ] }
      ]
    },
    {
      title: 'db.manager.living',
      items: [
        { link: '/db/meters', title: 'db.meters.title', icon: 'fa-solid fa-shapes' }
      ]
    },
    {
      title: 'db.manager.countries',
      items: [
        { link: '/db/countries', title: 'db.countries.title', icon: this.config.icons['country'] + this.colFinished, children: [
          { link: '/db/countries/taxrates', title: 'db.countries.taxrates.title', icon: 'fa-solid fa-shapes' },
        ] }
      ]
    },
    {
      title: 'db.manager.filesystem',
      items: [
        { link: '/db/dirs', title: 'db.directories.title', icon: 'fa-solid fa-shapes' }
      ]
    },
    {
      title: 'db.manager.work',
      items: [
        { link: '/db/work/customers', title: 'db.work.customers.title', icon: 'fa-solid fa-shapes' },
        { link: '/db/work/holidays', title: 'db.work.holidays.title', icon: 'fa-solid fa-shapes' },
        { link: '/db/work/offcategories', title: 'db.work.offcategories.title', icon: 'fa-solid fa-shapes' },
        { link: '/db/work/timecategories', title: 'db.work.timecategories.title', icon: 'fa-solid fa-shapes' },
      ]
    },
    {
      title: 'db.manager.system',
      items: [
        { link: '/db/cronjobs', title: 'db.cronjobs.title', icon: 'fa-solid fa-shapes' },
        { link: '/db/units', title: 'db.units.title', icon: 'fa-solid fa-shapes' },
        { link: '/db/oauth/services', title: 'db.oauth.services.title', icon: 'fa-solid fa-shapes' },
        { link: '/db/user', title: 'db.user.title', icon: 'fa-solid fa-shapes' },
      ]
    }
  ];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private router: Router) {
    this.userSettings.loadArchiveSettings();
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let olddata: string|null|DbManagerStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <DbManagerStorage>JSON.parse(olddata);
      this.cache = olddata;
    }
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.update();
  }

  update(): void {
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/db/stats' + (this.when > 0 ? '/' + this.when : '');
    let clean = this.when == 0;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <DbManagerStorage>reply.payload;
        if (clean) {
          this.cache = response;
        } else {
          for (let key in response.itemcount) {
            this.cache.itemcount[key] = response.itemcount[key];
          }
        }
        localStorage.setItem(this.storagename, JSON.stringify(this.cache));
      }
      this.busy = false;
      this.userSettings.setTimeout(setTimeout(() => { this.update(); }, 60000));
    });
  }

}

export interface DbManagerGroup {
  title: string,
  items: DbManagerLink[]
}

export interface DbManagerLink {
  link: string,
  title: string,
  icon: string,
  children?: null|DbManagerLink[]
}

export interface DbManagerStorage {
  itemcount: { [key: string]: number }
}
