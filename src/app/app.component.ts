import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService, AppConfig } from './config.service';
import { I18nService } from './i18n.service';
import { SettingsService } from './user/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ SettingsService ]
})
export class AppComponent {

  routeUrl: string = '';
  searchphrase: string = '';

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private router: Router)
  { }

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
