import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private strings: { [key: string]: string; } = {};

  constructor(private http: HttpClient) {
	   this.http = http;
  }

  loadLocalStrings() {
    return this.http.get('/assets/i18n/' + navigator.language + '.json')
      .toPromise()
      .then(i18nstrings => {
        i18nstrings = <{ [key: string]: any; }>i18nstrings;
        if (i18nstrings == undefined)
          return;
        for (const key in i18nstrings) {
          this.iterateStrings(<{ [key: string]: any; }>i18nstrings, key, '');
        }
        console.log(this.strings);
      });
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

  i18n(key: string) : string {
    if (this.strings[key] != undefined)
      return this.strings[key];
    return '<I18n: string \'' + key + '\' missing!>';
  }

}
