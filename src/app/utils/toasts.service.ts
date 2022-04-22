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

  public confirm(title: string, message: string) : void {
    this.add({
      disposeTime: 2500,
      icon: 'fa-regular fa-circle-check',
      message: message,
      title: title,
      when: new Date()
    });
  }
  
}

export interface Toast {
  closable?: boolean;
  disposable?: boolean;
  disposeTime?: number;
  icon?: string;
  message: string;
  title: string;
  type?: string;
  when?: Date;
}
