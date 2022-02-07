import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private locale: string = navigator.language.substr(0, 2);
  private strings: { [key: string]: string; } = {};

  constructor(private http: HttpClient) {
	   this.http = http;
  }

  loadLocalStrings(lang: string) {
    return this.http.get('/assets/i18n/' + lang + '/' + lang + '.json').subscribe(
      (i18nstrings) => {
        i18nstrings = <{ [key: string]: any; }>i18nstrings;
        if (i18nstrings == undefined)
          return;
        for (const key in i18nstrings) {
          this.iterateStrings(<{ [key: string]: any; }>i18nstrings, key, '');
        }
      },
      (error) => {
        if (lang != 'de')
          this.loadLocalStrings('de');
      }
    );
  }

  private iterateStrings(strings: { [key: string]: any; }, key: string, parent: string) : void {
    let mykey: string = (parent !== '' ? parent + '.' : '') + key;
    if (typeof strings[key] === 'object') {
      for (const childkey in strings[key]) {
        this.iterateStrings(<{ [key: string]: any; }>strings[key], childkey, mykey);
      }
    }
    else
      this.strings[mykey] = strings[key];
  }

  i18n(key: string, params: string[] = []) : string {
    if (this.strings[key] != undefined) {
      let str: string = this.strings[key];
      for (let i = 0; i < params.length; i++) {
        str = str.replace('{' + i + '}', params[i]);
      }
      return str;
    }
    return '<I18n: string \'' + key + '\' missing!>';
  }

  get Locale() : string {
    return this.locale;
  }

}
