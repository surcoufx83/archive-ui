import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { ApiReply, Currency, Stock, StockApi } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

  showMoreId: number = 0;
  sortColumns: string[] = ['difrel', 'name'];
  stocks: Stock[] = [];
  stocksStore: Stock[] = [];
  valueBought: number = 0;
  valueCurrent: number = 0;
  valueDifAbs: number = 0;
  valueDifRel: number = 0;
  currentRates: RateDate | null = null;
  currentSkipWithApi: boolean = true;
  savingRates: boolean = false;
  @ViewChild('closeRatesModalButton') closeRatesModalButton?: ElementRef;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    public formatService: FormatService) { }

  api(api: number | null): StockApi | null {
    return this.userSettings.getStocksApi(api);
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  createNewRates(keepdate?: boolean): void {
    let record: RateDate = {
      date: keepdate && this.currentRates ? this.currentRates.date : format(new Date(), 'y-M-d'),
      values: [],
    };
    let temp = [...this.stocksStore];
    temp.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1).forEach((s) => record.values.push({ stockid: s.id, stock: s, value: '' }));
    this.currentRates = record;
  }

  currency(cur: number): Currency {
    return this.userSettings.getCurrency(cur)!;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.userSettings.stocks$.subscribe((stocks) => {
      this.stocksStore = Object.values(stocks);
      this.sort();
      let bought = 0, current = 0;
      this.stocks.forEach((s) => {
        bought += s.bought.value;
        current += s.current.value;

      });
      this.valueBought = bought;
      this.valueCurrent = current;
      this.valueDifAbs = (current - bought);
      this.valueDifRel = this.valueDifAbs / this.valueBought;
    });
  }

  saveNewRates(record: RateDate | null): void {
    if (this.savingRates || !record)
      return;
    this.savingRates = true;
    console.log(record);
    this.authService.updateApi2('money/stocks/rates', record).subscribe((reply: ApiReply) => {
      this.savingRates = false;
      this.userSettings.resyncFinance();
      this.closeRatesModalButton?.nativeElement?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  }

  sort() {
    this.stocks = this.stocksStore.sort((a, b) => this.sort_compare2Stocks(a, b));
  }

  stock(id: number): Stock {
    return this.userSettings.getStock(id)!;
  }

  private sort_compare2Stocks(a: Stock, b: Stock): number {
    if (this.sortColumns.length === 0)
      return 0;
    for (let i = 0; i < this.sortColumns.length; i++) {
      let result = this.sort_compare2StocksByColumn(this.sortColumns[i], a, b);
      if (result !== 0)
        return result;
    }
    return 0;
  }

  private sort_compare2StocksByColumn(col: string, a: Stock, b: Stock): number {
    switch (col) {

      case 'api':
        return a.api === b.api ? 0 :
          (this.userSettings.getStocksApi(a.api)?.name.toLocaleLowerCase() ?? '') > (this.userSettings.getStocksApi(b.api)?.name.toLocaleLowerCase() ?? '') ? 1 : -1;

      case 'currency':
        return a.currency === b.currency ? 0 :
          (this.userSettings.getCurrency(a.currency)?.name.toLocaleLowerCase() ?? '') > (this.userSettings.getCurrency(b.currency)?.name.toLocaleLowerCase() ?? '') ? 1 : -1;

      case 'iscrypto':
        return a.iscrypto === b.iscrypto ? 0 : a.iscrypto > b.iscrypto ? 1 : -1;

      case 'boughtQantity':
        return a.bought.quantity == b.bought.quantity ? 0 :
          a.bought.quantity > b.bought.quantity ? -1 : 1;

      case 'boughtValue':
        return a.bought.value == b.bought.value ? 0 :
          a.bought.value > b.bought.value ? -1 : 1;

      case 'date':
        return a.current.date?.toLocaleLowerCase() == b.current.date?.toLocaleLowerCase() ? 0 :
          (a.current.date?.toLocaleLowerCase() ?? '') > (b.current.date?.toLocaleLowerCase() ?? '') ? 1 : -1;

      case 'difabs':
        return a.current.dif.abs == b.current.dif.abs ? 0 :
          a.current.dif.abs > b.current.dif.abs ? -1 : 1;

      case 'difrel':
        return a.current.dif.rel == b.current.dif.rel ? 0 :
          a.current.dif.rel > b.current.dif.rel ? -1 : 1;

      case 'iscrypto':
        return a.iscrypto === b.iscrypto ? 0 : a.iscrypto > b.iscrypto ? 1 : -1;

      case 'isin':
        return a.isin.toLocaleLowerCase() == b.isin.toLocaleLowerCase() ? 0 :
          a.isin.toLocaleLowerCase() > b.isin.toLocaleLowerCase() ? 1 : -1;

      case 'lastcheck':
        return a.lastcheck?.toLocaleLowerCase() == b.lastcheck?.toLocaleLowerCase() ? 0 :
          (a.lastcheck?.toLocaleLowerCase() ?? '') > (b.lastcheck?.toLocaleLowerCase() ?? '') ? 1 : -1;

      case 'rate':
        return a.current.rate == b.current.rate ? 0 :
          a.current.rate > b.current.rate ? 1 : -1;

      case 'symbol':
        return a.symbol?.toLocaleLowerCase() == b.symbol?.toLocaleLowerCase() ? 0 :
          (a.symbol?.toLocaleLowerCase() ?? '') > (b.symbol?.toLocaleLowerCase() ?? '') ? 1 : -1;

      case 'updated':
        return a.updated.toLocaleLowerCase() == b.updated.toLocaleLowerCase() ? 0 :
          a.updated.toLocaleLowerCase() > b.updated.toLocaleLowerCase() ? 1 : -1;

      case 'value':
        return a.current.value == b.current.value ? 0 :
          a.current.value > b.current.value ? -1 : 1;

      case 'wkn':
        return a.wkn.toLocaleLowerCase() == b.wkn.toLocaleLowerCase() ? 0 :
          a.wkn.toLocaleLowerCase() > b.wkn.toLocaleLowerCase() ? 1 : -1;
    }
    return 0;
  }

}

export interface RateDate {
  date: string;
  values: RateItem[];
}

export interface RateItem {
  stockid: number;
  stock: Stock;
  value: number | string;
}
