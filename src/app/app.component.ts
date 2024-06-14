import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from './auth.service';
import { I18nService } from './i18n.service';
import { ServerNotification } from './if';
import { SettingsService } from './utils/settings.service';
import { ToastsService } from './utils/toasts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SettingsService]
})
export class AppComponent implements OnInit, OnDestroy {

  private notifications: ServerNotification[] = [];
  private notificationsTimeout?: any;
  private notificationsSub?: Subscription;

  constructor(private authService: AuthService,
    private settings: SettingsService,
    private toasts: ToastsService,
    private i18nService: I18nService
  ) { }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get isLoggedin(): boolean {
    return this.authService.isLoggedin;
  }

  ngOnDestroy(): void {
    clearTimeout(this.notificationsTimeout);
    this.notificationsSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.notificationsSub = this.settings.notifications$.subscribe((notifications) => this.notifications = [...notifications]);
    this.showNotifications();
  }

  showNotifications(): void {
    clearTimeout(this.notificationsTimeout);
    this.notificationsTimeout = setTimeout(() => { this._showNotifications() }, 2000);
  }

  _showNotifications(): void {
    if (this.notifications.length > 0) {
      let n: ServerNotification = this.notifications.splice(0, 1)[0];
      switch (n.type) {
        case 'filecreated':
          this.toasts.confirm(
            this.i18n(`notifications.${n.type}.title`, ['' + n.refid, n.refdata!]),
            this.i18n(`notifications.${n.type}.message`, ['' + n.refid, n.refdata!]),
            [{
              icon: environment.icons['goto'],
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
