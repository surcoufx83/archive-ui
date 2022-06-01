import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  public toast$: BehaviorSubject<Toast|null> = new BehaviorSubject<Toast|null>(null);

  private add(toast: Toast) : void {
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

  public error(title: string, message: string) : void {
    this.add({
      disposeTime: 10000,
      icon: 'fa-regular fa-circle-xmark',
      message: message,
      title: title,
      type: 'error',
      when: new Date()
    });
  }

  public fatal(title: string, message: string) : void {
    this.add({
      closable: false,
      disposable: false,
      icon: 'fa-solid fa-triangle-exclamation',
      message: message,
      title: title,
      type: 'error'
    });
  }

  public warn(title: string, message: string) : void {
    this.add({
      disposeTime: 5000,
      icon: 'fa-regular fa-circle-xmark',
      message: message,
      title: title,
      type: 'warn',
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
