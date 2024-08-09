import { Component, OnDestroy, OnInit } from '@angular/core';
import { compareDesc, differenceInCalendarDays, parseISO, subMonths } from 'date-fns';
import { EChartsOption } from 'echarts';
import { Subscription, first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { ApiReply, ReceiptArticle, UserSettings } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-price-comparison',
  templateUrl: './price-comparison.component.html',
  styleUrls: ['./price-comparison.component.scss']
})
export class PriceComparisonComponent implements OnDestroy, OnInit {

  articlecharts: { [key: number]: EChartsOption } = {};
  articles: { [key: number]: ReceiptArticle } = {};
  icons = environment.icons;
  items: ComparisonItem[][] = [];
  subscriptions: Subscription[] = [];
  usersettingsObj: UserSettings | null = null;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    public formatService: FormatService,
  ) {
    this.i18nService.setTitle('pricecomparison.title');
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

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    let url: string = `${environment.api.baseUrl}/fin/comparison`;
    this.authService.queryApi(url).pipe(first()).subscribe((reply: ApiReply) => {
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
