import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppConfig, ConfigService, NavbarItem } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { User } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @ViewChild('navbarCollapseBtn') navbarCollapseBtn!: ElementRef;
  @ViewChild('navbarLocalesDropdown') navbarLocalesDropdownBtn!: ElementRef<HTMLButtonElement>;

  currentLocale: string = '';
  navbarVisible: boolean = false;
  navbarLocales: NavbarLocaleDefinition[] = [];
  routeUrl: string = '';
  searchphrase: string = '';
  user: User | null = null;

  constructor(private configService: ConfigService,
    private settings: SettingsService,
    private i18nService: I18nService,
    private router: Router,
    private route: ActivatedRoute) {
    let sub = this.i18nService.loaded.subscribe((state) => {
      if (state === true) {
        let temp: NavbarLocaleDefinition[] = [];
        this.i18nService.availableLocales.forEach((locale) => {
          temp.push({
            code: locale,
            i18nTitle: this.i18n(`locales.${locale}.title`),
            isDefault: locale == this.i18nService.defaultLocale
          });
        });
        this.navbarLocales = temp.sort((a, b) => a.isDefault ? -1 : b.isDefault ? 1 : a.i18nTitle > b.i18nTitle ? 1 : -1);
        sub.unsubscribe();
      }
    });
    this.i18nService.currentLocale.subscribe((l) => this.currentLocale = l);
    settings.user$.subscribe((user) => this.user = user);
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd)
        this.routeUrl = e.urlAfterRedirects;
    });
  }

  callFn(item: NavbarItem): void {
    eval(`this.${item.callFn!}()`);
  }

  changeLocaleTo(key: string, event: Event): void {
    event.stopPropagation();
    this.i18nService.setLocale(key);
  }

  clearCache(): void {
    this.settings.clearCache();
    this.settings.loadArchiveSettings();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  submitSearch(): void {
    if (this.searchphrase !== '')
      this.router.navigate(['search', this.searchphrase]);
    else
      this.router.navigate(['search']);
  }

}

export interface NavbarLocaleDefinition {
  code: string;
  i18nTitle: string;
  isDefault: boolean;
}
