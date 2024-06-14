import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarItem } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { User } from 'src/app/if';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy, OnInit {

  @ViewChild('navbarCollapseBtn') navbarCollapseBtn!: ElementRef;
  @ViewChild('navbarLocalesDropdown') navbarLocalesDropdownBtn!: ElementRef<HTMLButtonElement>;

  currentLocale: string = '';
  dropdownItems = environment.navigation.navbarDropdownItems
  icons = environment.icons;
  navbarItems = environment.navigation.navbarBarItems;
  navbarLocales: NavbarLocaleDefinition[] = [];
  navbarVisible: boolean = false;
  routeUrl: string = '';
  searchphrase: string = '';
  subscriptions: Subscription[] = [];
  user: User | null = null;

  constructor(
    private i18nService: I18nService,
    private router: Router,
    private settings: SettingsService,
  ) { }

  callFn(item: NavbarItem): void {
    if (item.callFn === 'clearCache')
      this.clearCache();
  }

  changeLocaleTo(key: string, event: Event): void {
    event.stopPropagation();
    this.i18nService.setLocale(key);
  }

  clearCache(): void {
    this.settings.clearCache();
    this.settings.loadArchiveSettings();
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.i18nService.loaded.subscribe((state) => {
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
      }
    }));
    this.subscriptions.push(this.i18nService.currentLocale.subscribe((l) => this.currentLocale = l));
    this.subscriptions.push(this.settings.user$.subscribe((user) => this.user = user));
    this.subscriptions.push(this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd)
        this.routeUrl = e.urlAfterRedirects;
    }));
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
