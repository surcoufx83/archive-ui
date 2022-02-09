import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Settings } from './settings';
import { AuthService } from '../../auth.service';
import { ConfigService } from '../../config.service';

@Injectable()
export class SettingsService {

  constructor(private authService: AuthService,
              private configService: ConfigService)
  { }

  private settings: ReplaySubject<Settings> = new ReplaySubject<Settings>();
  settings$ = this.settings.asObservable();

  update(settings: Settings, push: boolean = false) {
    this.settings.next(settings);
    if (push) {
      let url = this.configService.ApiBaseUrl + '/user/settings';
      this.authService.updateApi(url, {userSettings: settings});
    }
  }

}
