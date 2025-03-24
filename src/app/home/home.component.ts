import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Case, File, UserSettings } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth.service';
import { I18nService } from '../i18n.service';
import { FormatService } from '../utils/format.service';
import { SettingsService } from '../utils/settings.service';
import { L10nArchiveLocale } from '../l10n/l10n.types';
import { EChartsCoreOption, EChartsOption } from 'echarts';
import { parse } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  busy: boolean = false;
  etag?: string;
  icons = environment.icons;
  inactivecases: Case[] = [];
  inboxfiles: File[] = [];
  recentfiles: File[] = [];
  stats = signal<HomeStats | null>(null);
  stocksChart = signal<EChartsOption | null>(null);
  storagename: string = `${environment.localStoragePrefix}homeData`;
  updatetimeout: any;
  usersettingsObj: UserSettings | null = null;
  when: number = 0;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    public formatService: FormatService,
    public router: Router,
  ) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let olddata: string | null | HomeStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <HomeStorage>JSON.parse(olddata);
      this.inactivecases = olddata.inactivecases;
      this.inboxfiles = olddata.inboxfiles;
      this.recentfiles = olddata.recentfiles;
      this.stats.set(olddata.stats);
      this.etag = olddata.etag;
      this.createStocksChart();
    }
    this.i18nService.setTitle('home.title');
  }

  createStocksChart(): void {
    const dailyStats = this.stats()?.daily;
    if (!dailyStats) {
      this.stocksChart.set(null);
      return;
    }
    console.log(dailyStats)
    let chartOptions: EChartsOption = {
      xAxis: [{
        type: 'time',
      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: function (v, i) { return `${Math.floor(v / 1000)}k` },
          showMinLabel: false,
        }
      }],
      series: [
        {
          type: 'line',
          data: dailyStats.sort((a, b) => a.time.localeCompare(b.time)).map((v) => [parse(v.time, 'yyyy-MM-dd HH:mm:ss', new Date()), +v.stocks_value]),
        }
      ],
      legend: {
        show: false
      },
      title: {
        show: false
      },
      grid: {
        top: '10%',
        bottom: '10%',
      },
      tooltip: {
        trigger: 'item',
        position: 'right',
        valueFormatter: (v, i) => `${this.formatService.fcur(v as number)}`
      }
    }
    console.log(chartOptions)
    this.stocksChart.set(chartOptions);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnDestroy(): void {
    if (this.updatetimeout)
      clearTimeout(this.updatetimeout);
  }

  ngOnInit(): void {
    this.update();
  }

  update(): void {
    this.busy = true;
    let url: string = `${environment.api.baseUrl}/home`;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url, undefined, this.etag).pipe(first()).subscribe((reply) => {
      if (reply.status == HttpStatusCode.Ok && reply.success && reply.payload != undefined) {
        let response = <HomeResponse>reply.payload;
        this.inactivecases = response.inactivecases;
        this.inboxfiles = response.inboxfiles;
        this.recentfiles = response.recentfiles;
        this.stats.set(response.stats);
        this.createStocksChart();
        this.etag = reply.etag;
        localStorage.setItem(this.storagename, JSON.stringify(<HomeStorage>{
          inactivecases: this.inactivecases,
          inboxfiles: this.inboxfiles,
          recentfiles: this.recentfiles,
          stats: this.stats(),
          etag: reply.etag,
        }));
      }
      this.busy = false;
      this.updatetimeout = setTimeout(() => { this.update(); }, 60000);
    });
  }

  update_addInactiveCase(c: Case): void {
    let changeindex = -1;
    for (let i = 0; i < this.inactivecases.length - 1; i++) {
      if (this.inactivecases[i].id == c.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.inactivecases[changeindex] = c;
    else
      this.inactivecases.push(c);
  }

  update_addFile(f: File): void {
    let changeindex = -1;
    for (let i = 0; i < this.inboxfiles.length - 1; i++) {
      if (this.inboxfiles[i].id == f.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.inboxfiles[changeindex] = f;
    else
      this.inboxfiles.push(f);
  }

}

export interface HomeResponse {
  inactivecases: Case[];
  inboxfiles: File[];
  recentfiles: File[];
  stats: HomeStats;
}

export interface HomeStats {
  daily: HomeGeneralDailyStats[];
  general: HomeGeneralStats;
  newfiles: HomeinboxfilesStats;
}

export interface HomeGeneralStats {
  addresses_count: string;
  cases_active_count: string;
  cases_count: string;
  cases_draft_count: string;
  cases_old_count: string;
  classes_count: string;
  dir_count: string;
  extensions_count: string;
  file_count: string;
  file_size_avg: string;
  file_size_max: string;
  file_size_min: string;
  file_size_total: string;
  file_with_caseid: string;
  file_with_classid: string;
  file_with_clientid: string;
  file_with_partyid: string;
  file_withmultipleversions_count: string;
  file_withocr_count: string;
  freespace: string;
  invoices_count: string;
  invoices_topay_count: string;
  parties_count: number;
  stocks_value: string;
  time: string;
  totalspace: string;
}

export interface HomeGeneralDailyStats extends HomeGeneralStats {
  day: string;
  month: string;
  year: string;
}

export interface HomeinboxfilesStats {
  count: number;
  month: number;
  newest: string;
  oldest: string;
  year: number;
}

export interface HomeStorage {
  inactivecases: Case[];
  inboxfiles: File[];
  recentfiles: File[];
  stats: HomeStats;
  etag?: string;
}
