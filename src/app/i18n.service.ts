import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { de } from 'date-fns/locale';
import { Locale } from 'date-fns';
import { environment } from 'src/environments/environment';
import { ToastsService } from './utils/toasts.service';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private locale: string = navigator.language.substr(0, 2);
  private entries: {[key: string]: string} = {};

  constructor(private http: HttpClient,
    private toastService: ToastsService) {
    this.loadStrings(this.locale);
  }

  private loadStrings(locale: string) {
    this.http.get('/assets/i18n/' + locale + '/' + locale + '.json').subscribe({
      next: (strings: any) => {
        if (strings) {
          Object.entries(strings).forEach((e) => {
            this.iterateStrings('', e[0], <I18nEntry>e[1]);
          });
        }
      },
      error: () => {
        if (locale != environment.i18nFallback)
          this.loadStrings(environment.i18nFallback);
        else {
          this.toastService.add({
            disposable: false, closable: false,
            title: 'Application error',
            message: 'Error retrieving localization files!',
            when: new Date(),
            type: 'error'
          });
        }
      }
    });
  }

  private iterateStrings(parentkey: string, key: string, content: I18nEntry) : void {
    let mykey = (parentkey !== '' ? parentkey + '.' : '') + key;
    if (typeof content === 'object') {
      Object.entries(content).forEach((e) => {
        this.iterateStrings(mykey, e[0], <I18nEntry>e[1]);
      });
    }
    else
      this.entries[mykey] = content;
  }

  public i18n(key: string, params: string[] = []) : string {
    if (this.entries[key] != undefined) {
      let str: string = this.entries[key];
      for (let i = 0; i < params.length; i++) {
        str = str.replace('{' + i + '}', params[i]);
      }
      return str;
    }
    return `<I18n/${this.locale}: string '${key}' missing!>`;
  }

  get DateLocale() : undefined|Locale {
    switch (this.locale) {
      case 'de':
        return de;
    }
    return undefined;
  }

  get Locale() : string {
    return this.locale;
  }

}

export interface I18nEntry {
  [key: string]: I18nEntry|string;
}
