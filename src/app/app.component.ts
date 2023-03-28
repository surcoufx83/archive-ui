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


  constructor(private authService: AuthService,
              private configService: ConfigService)
  { }

  get config() : AppConfig {
    return this.configService.config;
  }

  get isLoggedin() : boolean {
    return this.authService.isLoggedin;
  }

}
