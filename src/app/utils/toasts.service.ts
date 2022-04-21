import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  public toast$: BehaviorSubject<Toast|null> = new BehaviorSubject<Toast|null>(null);

  public add(toast: Toast) : void {
    this.toast$.next(toast);
  }
  
}

export interface Toast {
  closable: boolean;
  disposable: boolean;
  disposeTime?: number;
  message: string;
  title: string;
  type?: string;
  when: Date;
}
