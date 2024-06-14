import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { ApiReply, Meter } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.scss']
})
export class ReadingsComponent implements OnInit {

  busy: boolean = true;
  dates: { [key: string]: number } = {};
  editRecord: ReadingDate | null = null;
  icons = environment.icons;
  meter: Meter[] = [];
  readings: ReadingDate[] = [];
  saving: boolean = false;
  showmeter: { [key: number]: boolean } = {};

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    public formatService: FormatService,
    public router: Router,
  ) {
    this.i18nService.setTitle('meter.readings.title');
  }

  date(date: Date | string, form: string): string {
    return this.formatService.fdate(date, form);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  getMeter(id: number): Meter | null {
    for (let i = 0; i < this.meter.length; i++) {
      if (this.meter[i].id === id)
        return this.meter[i];
    }
    return null;
  }

  getStep(meter: Meter): string {
    if (meter.decimals === 0)
      return '1';
    else return '.' + '1'.padStart(meter.decimals, '0');
  }

  newRecord(keepdate?: boolean): void {
    let record: ReadingDate = {
      date: keepdate && this.editRecord ? this.editRecord.date : format(new Date(), 'y-M-d'),
      values: [],
    };
    this.meter.forEach((m) => record.values.push({ meterid: m.id, value: '' }));
    this.editRecord = record;
  }

  ngOnInit(): void {
    this.authService.queryApi(`${environment.api.baseUrl}/meter/readings`).pipe(first()).subscribe((reply: ApiReply) => {
      if (reply.payload && reply.payload['meter']) {
        let items = (<Meter[]>(reply.payload['meter'])).sort((a, b) => this.sortMeter(a, b));
        let readings: ReadingDate[] = [];
        let dates: { [key: string]: number } = {};
        items.forEach((m) => {
          m.readings.forEach((r) => {
            if (!dates[r.date]) {
              dates[r.date] = readings.length;
              readings.push({ date: r.date, values: [] });
            }
            readings[dates[r.date]].values.push({ meterid: m.id, value: r.value });
          });
          this.showmeter[m.id] = true;
        });
        this.meter = items;
        this.readings = readings.sort((a, b) => a.date > b.date ? -1 : 1);
        this.dates = dates;
        this.busy = false;
      }
    });
  }

  number(n: number, fd: number = 0, md: number | undefined = undefined): string {
    return this.formatService.fnumber(n, fd, md);
  }

  saveRecord(record: ReadingDate | null): void {
    if (this.saving || !record)
      return;
    this.saving = true;
    this.authService.updateApi(`${environment.api.baseUrl}/meter/readings/create`, record).pipe(first()).subscribe((reply: ApiReply) => {
      if (reply.success && reply.payload && reply.payload['count'] && reply.payload['meter']) {
        let linecount = +reply.payload['count'];
        if (linecount > 0) {
          let newitems = (<Meter[]>(reply.payload['meter'])).sort((a, b) => this.sortMeter(a, b));
          newitems.forEach((m) => {
            m.readings.forEach((r) => {
              if (!this.dates[r.date]) {
                this.dates[r.date] = this.readings.length;
                this.readings.push({ date: r.date, values: [] });
              }
              this.readings[this.dates[r.date]].values.push({ meterid: m.id, value: r.value });
            });
            if (!this.getMeter(m.id)) {
              this.meter.push(m);
              this.showmeter[m.id] = true;
            }
          });
          this.readings = this.readings.sort((a, b) => a.date > b.date ? -1 : 1);
        }
      }
      this.saving = false;
    });
  }

  showRecord(record: ReadingDate): boolean {
    for (let i = 0; i < record.values.length; i++) {
      if (this.showmeter[record.values[i].meterid])
        return true;
    }
    return false;
  }

  sortMeter(a: Meter, b: Meter): number {
    if (a.name > b.name) {
      return 1;
    } else if (a.name == b.name) {
      return a.number > b.number ? 1 : -1;
    } else {
      return -1;
    }
  }

}

export interface ReadingDate {
  date: string;
  values: ReadingItem[];
}

export interface ReadingItem {
  meterid: number;
  value: number | string;
}
