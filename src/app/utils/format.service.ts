import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import * as _filesize from 'filesize';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private configService: ConfigService, private i18nService: I18nService,) { }

  filesize(size: number) : string {
    return _filesize(size);
  }

  fdate(date: Date|string|null, form: string): string {
    if (date == null)
      return this.i18nService.i18n('common.novalue');
    if (typeof(date) === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fnumber(n: number, fd: number = 0) : string {
    if (n == undefined)
      return '';
    return n.toLocaleString(this.i18nService.Locale, {minimumFractionDigits: fd});
  }


}
