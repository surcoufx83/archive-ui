import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService, AppConfig } from './config.service';
import { I18nService } from './i18n.service';
import { SettingsService } from './user/settings/settings.service';
import { User } from './user/user';
import { WorkProperties } from './work/work';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ SettingsService ]
})
export class AppComponent implements OnInit {

  routeUrl: string = '';
  searchphrase: string = '';

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router,
              private settings: SettingsService)
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

  ngOnInit() {
    let url = this.config.api.baseUrl + '/user/settings';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        this.settings.updateUser(<User>reply.payload['user']);
        this.settings.updateWorkProps(<WorkProperties>reply.payload['work']);
      } else {
        if (!reply.success && reply.redirect != null && reply.redirectTo != null) {
          if (reply.redirect === true && reply.redirectTo === '/login') {
            this.authService.logout();
          }
        }
      }
    });
  }

  submitSearch() : void {
    if (this.searchphrase !== '')
      this.router.navigate(['search', this.searchphrase, Math.floor(Date.now() / 1000)]);
    else
      this.router.navigate(['search', '', Math.floor(Date.now() / 1000)]);
  }

}
