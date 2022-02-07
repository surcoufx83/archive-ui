import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { WorkSettings } from './work-settings';

@Injectable()
export class WorkSettingsService {

  private workSettings: ReplaySubject<WorkSettings> = new ReplaySubject<WorkSettings>();
  workSettings$ = this.workSettings.asObservable();

  update(settings: WorkSettings) {
    this.workSettings.next(settings);
  }

}
