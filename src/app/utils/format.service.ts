import { Injectable } from '@angular/core';
import { format, formatDistanceToNow } from 'date-fns';
import { Currency } from 'src/app/if';
import { I18nService } from '../i18n.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {


  private static fsunits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  constructor(private i18nService: I18nService) { }

  filesize(size: number, fd: number = 0, md: number | undefined = undefined): string {
    if (size <= 0)
      return '0 B';
    let f = Math.floor(Math.log(size) / Math.log(1024));
    return `${this.fnumber(size / Math.pow(1024, f), fd, md)} ${FormatService.fsunits[f]}`;
  }

  fcur(n: number, c?: Currency): string {
    return new Intl.NumberFormat(this.i18nService.Locale, { style: 'currency', currency: c?.shortname ?? 'EUR' }).format(n);
  }

  fdur(duration: Duration | null): string {
    if (duration == null)
      return '';
    let items = [];
    if (!duration.years)
      duration.years = 0;
    if (!duration.months)
      duration.months = 0;
    if (!duration.days)
      duration.days = 0;
    if (!duration.hours)
      duration.hours = 0;
    if (!duration.minutes)
      duration.minutes = 0;
    if (!duration.seconds)
      duration.seconds = 0;
    while (duration.seconds > 59) {
      duration.minutes += 1;
      duration.seconds -= 60;
    }
    while (duration.minutes > 59) {
      duration.hours += 1;
      duration.minutes -= 60;
    }
    while (duration.hours > 23) {
      duration.days += 1;
      duration.hours -= 24;
    }
    while (duration.days > 30) {
      duration.months += 1;
      duration.days -= 31;
    }
    while (duration.months > 11) {
      duration.years += 1;
      duration.months -= 12;
    }
    if (duration.years > 0)
      items.push(this.i18nService.i18n('common.period.patternYears', [this.fnumber(duration.years)]));
    if (duration.months > 0)
      items.push(this.i18nService.i18n('common.period.patternMonths', [this.fnumber(duration.months)]));
    if (duration.days > 0)
      items.push(this.i18nService.i18n('common.period.patternDays', [this.fnumber(duration.days)]));
    if (duration.hours > 0 || duration.minutes > 0 || duration.seconds > 0)
      items.push(this.i18nService.i18n('common.period.patternTime', [this.fnumber(duration.hours), this.fnumber(duration.minutes), this.fnumber(duration.seconds)]));
    return items.join(' ');
  }

  fdate(date: Date | string | null, form: string): string {
    if (date == null)
      return this.i18nService.i18n('common.novalue');
    if (typeof (date) === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fdist(date: Date | string | null, suffix: boolean | undefined = undefined): string {
    if (date == null)
      return this.i18nService.i18n('common.novalue');
    if (typeof (date) === 'string')
      date = new Date(date);
    return formatDistanceToNow(date, { locale: this.i18nService.DateLocale, addSuffix: suffix });
  }

  fnumber(n: number, fd: number = 0, md: number | undefined = undefined): string {
    return (+n).toLocaleString(this.i18nService.Locale, { minimumFractionDigits: fd, maximumFractionDigits: md });
  }

  fpercent(n: number, fd: number = 0, md: number | undefined = undefined): string {
    return (+n).toLocaleString(this.i18nService.Locale, { minimumFractionDigits: fd, maximumFractionDigits: md }) + '%';
  }

  furl(inputStr: string): string {
    return inputStr.replace(/[^a-zA-Z0-9\-]/ig, '-').replace(/\-+/ig, '-').replace(/^\-|\-$/ig, '');
  }

}
