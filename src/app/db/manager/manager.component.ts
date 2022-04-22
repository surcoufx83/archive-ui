import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { WorkLead } from 'src/app/work/work';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class DbManagerComponent implements OnInit {

  busy: boolean = false;
  usersettingsObj: Settings|null = null;
  
  items: any = [
    { link: '/db/classes', title: 'db.classes.title', icon: 'fa-solid fa-caret-right' },
    { link: '/db/cases', title: 'db.cases.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/cases/actions', title: 'db.cases.actions.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/cases/status', title: 'db.cases.status.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/cases/types', title: 'db.cases.types.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/cases/filetypes', title: 'db.cases.filetypes.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/contacts/types', title: 'db.contacts.types.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/countries', title: 'db.countries.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/countries/taxrates', title: 'db.countries.taxrates.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/currencies', title: 'db.currencies.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/accounts', title: 'db.accounts.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/accounts/mandates', title: 'db.accounts.mandates.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/accounts/orders', title: 'db.accounts.orders.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/stocks', title: 'db.stocks.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/stocks/apis', title: 'db.stocks.apis.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/parties', title: 'db.parties.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/parties/addresses', title: 'db.parties.addresses.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/parties/contacts', title: 'db.parties.contacts.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/parties/roles', title: 'db.parties.roles.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/articles', title: 'db.articles.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/articles/categories', title: 'db.articles.categories.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/meters', title: 'db.meters.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/extension', title: 'db.extension.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/cronjobs', title: 'db.cronjobs.title', icon: 'fa-solid fa-shapes' },
    { link: '/db/oauth/sevices', title: 'db.oauth.services.title', icon: 'fa-solid fa-shapes' },
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
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
  }

}
