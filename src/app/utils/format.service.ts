import { Injectable } from '@angular/core';
import { format, formatDistanceToNow } from 'date-fns';
import * as _filesize from 'filesize';
import { Currency } from '../account/account';
import { I18nService } from '../i18n.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private i18nService: I18nService) { }

  filesize(size: number) : string {
    return _filesize(size);
  }

  fcur(n: number, c?: Currency) : string {
    return new Intl.NumberFormat(this.i18nService.Locale, { style: 'currency', currency: c?.shortname ?? 'EUR' }).format(n);
  }

  fdate(date: Date|string|null, form: string): string {
    if (date == null)
      return this.i18nService.i18n('common.novalue');
    if (typeof(date) === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fdist(date: Date|string|null): string {
    if (date == null)
      return this.i18nService.i18n('common.novalue');
    if (typeof(date) === 'string')
      date = new Date(date);
    return formatDistanceToNow(date, { locale: this.i18nService.DateLocale });
  }

  fnumber(n: number, fd: number = 0) : string {
    if (n == undefined)
      return '';
    return n.toLocaleString(this.i18nService.Locale, {minimumFractionDigits: fd});
  }

  fpercent(n: number, fd: number = 0) : string {
    if (n == undefined)
      return '';
    return n.toLocaleString(this.i18nService.Locale, {minimumFractionDigits: fd}) + '%';
  }

}
