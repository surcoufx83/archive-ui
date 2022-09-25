import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { de } from 'date-fns/locale';
import { Locale } from 'date-fns';
import { environment } from 'src/environments/environment';
import { ToastsService } from './utils/toasts.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private locale: string = navigator.language.substr(0, 2);
  private entries: { [key: string]: { [key: string]: string|string[] } } = {};

  constructor(private http: HttpClient,
    private toastService: ToastsService) {
    this.loadStrings(this.locale);
    if (this.locale != environment.i18nFallback)
      this.loadStrings(environment.i18nFallback);
  }

  private loadStrings(locale: string) {
    this.http.get('/assets/i18n/' + locale + '/' + locale + '.json').subscribe({
      next: (strings: any) => {
        if (!this.entries[locale])
          this.entries[locale] = {};
        if (strings) {
          Object.entries(strings).forEach((e) => {
            this.iterateStrings(locale, '', e[0], <I18nEntry>e[1]);
          });
          if (locale === this.locale)
            this.loaded.next(true);
        }
      },
      error: () => {
        this.toastService.fatal('Application error', 'Error retrieving localization files!');
      }
    });
  }

  private iterateStrings(locale: string, parentkey: string, key: string, content: I18nEntry): void {
    let mykey = (parentkey !== '' ? parentkey + '.' : '') + key;
    if (typeof content === 'object' && !Array.isArray(content)) {
      Object.entries(content).forEach((e) => {
        this.iterateStrings(locale, mykey, e[0], <I18nEntry>e[1]);
      });
    }
    else
      this.entries[locale][mykey] = content;
  }

  public i18n(key: string, params: any[] = [], i: number = 0): string {
    return this.i18n_locale(this.locale, key, params, i);
  }

  private i18n_locale(locale: string, key: string, params: any[] = [], i: number = 0): string {
    if (this.entries[locale] == undefined)
      return '...';
    if (this.entries[locale][key] != undefined) {
      let str: string = '';
      if (Array.isArray(this.entries[locale][key])) {
        str = (<string[]>this.entries[locale][key])[i];
      } else {
        str = <string>this.entries[locale][key];
      }
      for (let i = 0; i < params.length; i++) {
        str = str.replace('{' + i + '}', params[i]);
      }
      return str;
    }
    if (locale != environment.i18nFallback)
      return this.i18n_locale(environment.i18nFallback, key, params, i);
    return `<I18n/${locale}: string '${key}' missing!>`;
  }

  get DateLocale(): undefined | Locale {
    switch (this.locale) {
      case 'de':
        return de;
    }
    return undefined;
  }

  get Locale(): string {
    return this.locale;
  }

}

export interface I18nEntry {
  [key: string]: I18nEntry | string;
}
