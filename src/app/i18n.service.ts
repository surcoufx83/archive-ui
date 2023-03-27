import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Locale } from 'date-fns';
import { de, enUS, fr } from 'date-fns/locale';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';
import { ToastsService } from './utils/toasts.service';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  public availableLocales: string[] = ['en', 'de', 'fr'];
  public defaultLocale: string = 'en';
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private locale: string = navigator.language.substring(0, 2);
  private entries: { [key: string]: { [key: string]: string | string[] } } = {};

  get DateLocale(): Locale {
    switch (this.locale) {
      case 'de':
        return de;
      case 'fr':
        return fr;
      case 'en':
      default:
        return enUS;
    }
  }

  get Locale(): string {
    return this.locale;
  }

  constructor(private configService: ConfigService,
    private http: HttpClient,
    private titleService: Title,
    private toastService: ToastsService) {
    let olddata: string | null | LocalesStorage = localStorage.getItem(`${this.configService.config.storage.prefix}locale`);
    if (olddata !== null) {
      olddata = <LocalesStorage>JSON.parse(olddata);
      if (this.availableLocales.indexOf(olddata.locale) > -1)
        this.locale = olddata.locale;
    }
    if (this.availableLocales.indexOf(this.locale) == -1)
      this.locale = this.defaultLocale;
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

  public setLocale(key: string): void {
    if (this.availableLocales.indexOf(this.locale) == -1)
      return;
    this.locale = key;
    this.loadStrings(this.locale);
    let storeItem: LocalesStorage = {
      locale: this.locale
    };
    localStorage.setItem(`${this.configService.config.storage.prefix}locale`, JSON.stringify(storeItem));
  }

  private titleTimeout?: any;
  public setTitle(key: string, params: any[] = [], i: number = 0): void {
    if (this.titleTimeout !== undefined)
      clearTimeout(this.titleTimeout);
    if (!this.loaded.value)
      this.titleTimeout = setTimeout(() => {
        this.setTitle(key, params, i);
      }, 100);
    this.titleService.setTitle(this.i18n(key, params, i));
  }

}

export interface I18nEntry {
  [key: string]: I18nEntry | string;
}

export interface LocalesStorage {
  locale: string;
}
