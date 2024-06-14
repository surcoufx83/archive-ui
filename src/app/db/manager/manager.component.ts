import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

const DbManagerItems: DbManagerGroup[] = [
  {
    title: 'db.manager.files',
    items: [
      { link: '/db/classes', title: 'db.classes.title', icon: `${environment.icons['class']} text-success` },
      {
        link: '/cases', title: 'db.cases.title', icon: `${environment.icons['cases']} text-success`, children: [
          { link: '/db/cases/status', title: 'db.cases.status.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/cases/types', title: 'db.cases.types.title', icon: 'fa-solid fa-shapes' },
        ]
      }
    ]
  },
  {
    title: 'db.manager.parties',
    items: [
      {
        link: '/db/parties', title: 'db.parties.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/parties/clients', title: 'db.parties.clients.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/parties/banks', title: 'db.parties.banks.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/parties/addresses', title: 'db.parties.addresses.title', icon: 'fa-solid fa-shapes' },
          {
            link: '/db/parties/contacts', title: 'db.parties.contacts.title', icon: 'fa-solid fa-shapes', children: [
              { link: '/db/parties/contacts/types', title: 'db.contacts.types.title', icon: `${environment.icons['contacttype']} text-success` },
            ]
          },
          { link: '/db/parties/roles', title: 'db.parties.roles.title', icon: `${environment.icons['role']} text-success` },
        ]
      }
    ]
  },
  {
    title: 'db.manager.finance',
    items: [
      {
        link: '/db/accounts', title: 'db.accounts.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/accounts/mandates', title: 'db.accounts.mandates.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/accounts/orders', title: 'db.accounts.orders.title', icon: 'fa-solid fa-shapes' },
        ]
      },
      {
        link: '/db/stocks', title: 'db.stocks.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/stocks/apis', title: 'db.stocks.apis.title', icon: 'fa-solid fa-shapes' },
        ]
      },
      {
        link: '/db/articles', title: 'db.articles.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/articles/categories', title: 'db.articles.categories.title', icon: 'fa-solid fa-shapes' },
        ]
      },
      {
        link: '/expenses', title: 'db.expenses.title', icon: 'fa-solid fa-shapes', children: [
          { link: '/db/expenses/categories', title: 'db.expenses.categories.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/expenses/templates', title: 'db.expenses.templates.title', icon: 'fa-solid fa-shapes' },
          { link: '/db/expenses/types', title: 'db.expenses.types.title', icon: 'fa-solid fa-shapes' },
        ]
      }
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
      { link: '/db/countries', title: 'db.countries.title', icon: `${environment.icons['country']} text-success` },
      { link: '/db/currencies', title: 'db.currencies.title', icon: `${environment.icons['currency']} text-success` },
    ]
  },
  {
    title: 'db.manager.filesystem',
    items: [
      { link: '/db/dirs', title: 'db.directories.title', icon: `${environment.icons['folder']} text-success` },
      { link: '/db/extensions', title: 'db.extensions.title', icon: `fa-solid fa-shapes text-success` },
      { link: '/db/mimetypes', title: 'db.mimetypes.title', icon: 'fa-solid fa-shapes' },
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
      { link: '/db/tags', title: 'db.tags.title', icon: 'fa-solid fa-shapes' },
      { link: '/db/oauth/services', title: 'db.oauth.services.title', icon: 'fa-solid fa-shapes' },
      { link: '/db/user', title: 'db.user.title', icon: 'fa-solid fa-shapes' },
    ]
  }
];

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class DbManagerComponent implements OnDestroy, OnInit {

  busy: boolean = false;
  cache: DbManagerStorage = { itemcount: {} };
  icons = environment.icons;
  items = DbManagerItems;
  storagename: string = `${environment.localStoragePrefix}dbmanagerData`;
  subscriptions: Subscription[] = [];
  usersettingsObj: UserSettings | null = null;
  when: number = 0;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
  ) {
    this.userSettings.loadArchiveSettings();
    let olddata: string | null | DbManagerStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <DbManagerStorage>JSON.parse(olddata);
      this.cache = olddata;
    }
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.update();
  }

  update(): void {
    this.busy = true;
    let url: string = `${environment.api.baseUrl}/db/stats${this.when > 0 ? `/${this.when}` : ''}`;
    let clean = this.when == 0;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).pipe(first()).subscribe((reply) => {
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
  children?: null | DbManagerLink[]
}

export interface DbManagerStorage {
  itemcount: { [key: string]: number }
}
