import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AppConfig, ConfigService } from './config.service';
import { SettingsService } from './user/settings/settings.service';
import { ToastsService } from './utils/toasts.service';
import { ServerNotification } from './if';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SettingsService]
})
export class AppComponent implements OnInit, OnDestroy {

  private notifications: ServerNotification[] = [];
  private sub?: any;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private settings: SettingsService,
    private toasts: ToastsService,
    private i18nService: I18nService) { }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get isLoggedin(): boolean {
    return this.authService.isLoggedin;
  }

  ngOnDestroy(): void {
    if (this.sub)
      clearTimeout(this.sub);
  }

  ngOnInit(): void {
    this.settings.notifications$.subscribe((notifications) => this.notifications = [...notifications]);
    this.showNotifications();
  }

  showNotifications(): void {
    if (this.sub)
      clearTimeout(this.sub);
    this.sub = setTimeout(() => { this._showNotifications() }, 2000);
  }

  _showNotifications(): void {
    console.log(this.notifications);
    if (this.notifications.length > 0) {
      let n: ServerNotification = this.notifications.splice(0, 1)[0];
      switch (n.type) {
        case 'filecreated':
          this.toasts.confirm(
            this.i18n(`notifications.${n.type}.title`, ['' + n.refid, n.refdata!]),
            this.i18n(`notifications.${n.type}.message`, ['' + n.refid, n.refdata!]),
            [{
              icon: this.config.icons['goto'],
              title: this.i18n(`notifications.${n.type}.action`),
              url: ['/file', '' + n.refid]
            }],
            18000
          );
          this.settings.onNotificationShown(n.id);
          break;

        default:
          this.settings.onNotificationShown(n.id);
          break;
      }
    }
    this.showNotifications();
  }

}
