import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AppConfig, ConfigService } from './config.service';
import { I18nService } from './i18n.service';
import { SettingsService } from './user/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ SettingsService ]
})
export class AppComponent {

  navbarLocales: NavbarLocaleDefinition[] = [];
  routeUrl: string = '';
  searchphrase: string = '';

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private router: Router)
  {
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
  }

  changeLocaleTo(key: string, event: Event): void {
    event.stopPropagation();
    this.i18nService.setLocale(key);
  }

  get config() : AppConfig {
    return this.configService.config;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  get isLoggedin() : boolean {
    return this.authService.isLoggedin;
  }

  submitSearch() : void {
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
