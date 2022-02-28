import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Settings } from './settings';
import { AuthService } from '../../auth.service';
import { ConfigService } from '../../config.service';
import { WorkProperties } from '../../work/work';
import { User } from '../user';

@Injectable()
export class SettingsService {

  constructor(private authService: AuthService,
              private configService: ConfigService)
  { }

  private settings: ReplaySubject<Settings> = new ReplaySubject<Settings>();
  settings$ = this.settings.asObservable();
  private user: ReplaySubject<User> = new ReplaySubject<User>();
  user$ = this.user.asObservable();
  private workprops: ReplaySubject<WorkProperties> = new ReplaySubject<WorkProperties>();
  workprops$ = this.workprops.asObservable();

  updateSettings(settings: Settings, push: boolean = false) {
    this.settings.next(settings);
    if (push) {
      let url = this.configService.config.api.baseUrl + '/user/settings';
      this.authService.updateApi(url, {userSettings: settings});
    }
  }

  updateUser(user: User, push: boolean = false) {
    this.user.next(user);
    this.updateSettings(user.settings, push);
  }

  updateWorkProps(props: WorkProperties, push: boolean = false) {
    this.workprops.next(props);
    if (push) {
      let url = this.configService.config.api.baseUrl + '/work/settings';
      this.authService.updateApi(url, {workSettings: props});
    }
  }

}
