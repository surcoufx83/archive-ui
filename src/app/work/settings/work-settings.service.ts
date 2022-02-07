import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WorkSettings } from './work-settings';

@Injectable()
export class WorkSettingsService {

  private workSettings: Subject<WorkSettings> = new Subject<WorkSettings>();
  workSettings$ = this.workSettings.asObservable();

  update(settings: WorkSettings) {
    this.workSettings.next(settings);
  }

}
