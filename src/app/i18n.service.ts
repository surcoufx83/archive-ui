import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Locale } from 'date-fns';
import { de, enUS, fr } from 'date-fns/locale';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { L10nArchiveLocale } from './l10n/l10n.types';
import { L10nArchiveDeLocale } from './l10n/locales/de';
import { L10nArchiveEnLocale } from './l10n/locales/en';
import { L10nArchiveFrLocale } from './l10n/locales/fr';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private locale: string = navigator.language.substring(0, 2);
  public availableLocales: string[] = ['en', 'de', 'fr'];
  private currentLocale_: BehaviorSubject<string> = new BehaviorSubject<string>(this.locale);
  public currentLocale = this.currentLocale_.asObservable();
  public defaultLocale: string = 'en';
  private localeAsObject: L10nArchiveLocale = { ...(environment.l10n.fallbackLocale == 'de' ? L10nArchiveDeLocale : environment.l10n.fallbackLocale == 'fr' ? L10nArchiveFrLocale : L10nArchiveEnLocale) };
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private entries: { [key: string]: { [key: string]: string | string[] } } = { en: {}, de: {}, fr: {} };

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

  constructor(
    private titleService: Title,
  ) {
    this.currentLocale_.subscribe((locale) => {
      this.locale = locale;
      this.loadStrings(locale);
    });
    let olddata: string | null | LocalesStorage = localStorage.getItem(`locale`);
    if (olddata !== null) {
      olddata = <LocalesStorage>JSON.parse(olddata);
      if (this.availableLocales.indexOf(olddata.locale) > -1)
        this.currentLocale_.next(olddata.locale);
    }
    if (this.availableLocales.indexOf(this.currentLocale_.value) == -1)
      this.currentLocale_.next(this.defaultLocale);
  }

  private loadStrings(locale: string) {
    this.localeAsObject = { ...(locale == 'de' ? L10nArchiveDeLocale : locale == 'fr' ? L10nArchiveFrLocale : L10nArchiveEnLocale) };
    Object.entries(<I18nEntry>this.localeAsObject).forEach((e) => {
      this.iterateStrings(locale, '', e[0], <I18nEntry>e[1]);
    });
    this.loaded.next(true);
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
    return this.i18n_locale(this.currentLocale_.value, key, params, i);
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
    if (locale != environment.l10n.fallbackLocale)
      return this.i18n_locale(environment.l10n.fallbackLocale, key, params, i);
    return `<I18n/${locale}: string '${key}' missing!>`;
  }

  public setLocale(key: string): void {
    if (this.availableLocales.indexOf(key) == -1)
      return;
    this.currentLocale_.next(key);
    let storeItem: LocalesStorage = {
      locale: this.locale
    };
    localStorage.setItem(`locale`, JSON.stringify(storeItem));
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

  public get str(): L10nArchiveLocale {
    return this.localeAsObject;
  }

}

export interface I18nEntry {
  [key: string]: I18nEntry | string | string[];
}

export interface LocalesStorage {
  locale: string;
}
