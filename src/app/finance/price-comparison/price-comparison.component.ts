import { Component, OnInit } from '@angular/core';
import { compareDesc, differenceInCalendarDays, parseISO, subMonths, subYears } from 'date-fns';
import formatISO from 'date-fns/formatISO';
import { EChartsOption } from 'echarts';
import { ApiReply } from 'src/app/if';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';
import { ToastsService } from 'src/app/utils/toasts.service';
import { ReceiptArticle } from 'src/app/if';

@Component({
  selector: 'app-price-comparison',
  templateUrl: './price-comparison.component.html',
  styleUrls: ['./price-comparison.component.scss']
})
export class PriceComparisonComponent implements OnInit {

  articles: { [key: number]: ReceiptArticle } = {};
  articlecharts: { [key: number]: EChartsOption } = {};
  items: ComparisonItem[][] = [];
  usersettingsObj: UserSettings | null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    public formatService: FormatService,
    private toastService: ToastsService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  createChartData(items: { [key: number]: ComparisonItem[] }): void {
    this.articlecharts = {};
    let mindate = subMonths(new Date(), 6);
    let today = new Date();
    for (let artid in this.articles) {
      if (!items[artid])
        continue;
      let max = this.max(items[artid]);
      let series: number[][] = [];
      items[artid].forEach((i) => {
        if (compareDesc(mindate, parseISO(i.date)) != -1) {
          series.push([differenceInCalendarDays(parseISO(i.date), today) + 183, i.singleprice]);
        }
      });
      this.articlecharts[artid] = {
        xAxis: [{
          min: 0, max: 183
        }],
        yAxis: [{
          min: 0,
          max: max * 1.3
        }],
        series: [{
          type: 'scatter',
          data: series
        }]
      };
    }
  }

  first(items: ComparisonItem[]): string {
    let min = '2099-12-31';
    items.forEach((i) => { if (i.date < min) min = i.date });
    return min;
  }

  getSeries(items: ComparisonItem[]): number[] {
    return items.map(ci => ci.singleprice);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  last(items: ComparisonItem[]): string {
    let max = '2000-01-01';
    items.forEach((i) => { if (i.date > max) max = i.date });
    return max;
  }

  max(items: ComparisonItem[]): number {
    let max = 0.0;
    items.forEach((i) => { if (i.singleprice > max) max = i.singleprice });
    return max;
  }

  min(items: ComparisonItem[]): number {
    let min = 999999.0;
    items.forEach((i) => { if (i.singleprice < min) min = i.singleprice });
    return min;
  }

  ngOnInit(): void {
    let url: string = this.config.api.baseUrl + '/fin/comparison';
    this.authService.queryApi(url).subscribe((reply: ApiReply) => {
      if (reply.success) {
        this.articles = (<ComparisonReply>reply.payload).articles;
        this.createChartData((<ComparisonReply>reply.payload).items);
        this.items = Object.values((<ComparisonReply>reply.payload).items);
        this.sortItems();
      }
      console.log(this.articles);
      console.log(this.items);
    });
  }

  sortItems(): void {
    this.items.sort((a, b) => {
      return a[0].name > b[0].name ? 1 : a[0].name < b[0].name ? -1 : a[0].search > b[0].search ? 1 : -1
    });
    this.items.forEach((i) => console.log(i[0].name, i[0].search))
  }

}

export interface ComparisonItem {
  articleid: number;
  count: number;
  date: string;
  itemid: number;
  name: string;
  organic: boolean;
  receiptid: number;
  search: string;
  singleprice: number;
}

export interface ComparisonReply {
  articles: { [key: number]: ReceiptArticle };
  items: { [key: number]: ComparisonItem[] };
}
