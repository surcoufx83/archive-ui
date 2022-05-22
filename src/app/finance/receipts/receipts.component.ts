 import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Currency } from 'src/app/account/account';
import { AuthService } from 'src/app/auth.service';
import { Country, Party } from 'src/app/common';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';
import { Receipt, ReceiptArticle, ReceiptArticleCategory, TaxRate } from '../finance';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {
  
  activeArticleIndex: number = -1;
  activeArticleDropdownItems: ReceiptArticle[] = [];
  articles: ReceiptArticle[] = [];
  busy: boolean = false;
  categories: ReceiptArticleCategory[] = [];
  clients: Party[] = [];
  countries: Country[] = [];
  currencies: Currency[] = [];
  parties: Party[] = [];
  receipts: Receipt[] = [];
  taxrates: TaxRate[] = [];
  usersettingsObj: Settings|null = null;

  defaultCurrency!: Currency;
  selectedReceipt: Receipt|null = null;
  selectedTotals: ReceiptTotals = { items: 0, discount: 0, deposit: 0, singleprice: 0, gross: 0 };

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService,
    @Inject(DOCUMENT) private document: Document) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  article(id: number) : ReceiptArticle|null {
    let filter = this.articles.filter(a => a.id == id);
    if (filter.length === 1)
      return filter[0];
    return null;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date|string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  new() : void {
    this.busy = true;
    this.selectedReceipt = null;
    this.selectedTotals = { items: 0, discount: 0, deposit: 0, singleprice: 0, gross: 0 };
    this.selectedReceipt = {
      id: 0,
      currency: this.defaultCurrency,
      currencyid: this.defaultCurrency.id,
      client: null,
      clientid: null,
      party: null,
      partyid: null,
      date: format(new Date(), 'yyyy-MM-dd'),
      net: 0.0,
      tax1: 0.0,
      tax2: 0.0,
      tax3: 0.0,
      tax1_net: 0.0,
      tax2_net: 0.0,
      tax3_net: 0.0,
      tax1_amount: 0.0,
      tax2_amount: 0.0,
      tax3_amount: 0.0,
      gross1: 0.0,
      gross2: 0.0,
      gross3: 0.0,
      gross_total: 0.0,
      items: []
    };
    this.busy = false;
    console.log(this.selectedReceipt)
  }

  newItem(): void {
    if (this.selectedReceipt) {
      this.selectedReceipt.items.push({
        id: 0,
        receiptid: this.selectedReceipt.id,
        articleid: null,
        singleprice: 0.0,
        quantity: 1,
        discount: 0.0,
        deposit: 0.0,
        totalnet: 0.0,
      });
    }
  }

  ngOnInit(): void {
    this.update();
  }

  onChangeCurrency(): void {
    if (this.selectedReceipt) {
      this.selectedReceipt.currency = this.currencies.find((c) => c.id == +(this.selectedReceipt!.currencyid)) ?? this.defaultCurrency;
    }
  }

  onChangeInput(e: KeyboardEvent): void {
    let input: string = (<HTMLInputElement>e.target).value.toLowerCase();
    this.activeArticleDropdownItems = this.articles.filter((a) => a.name.toLowerCase().indexOf(input) > -1 || a.search.toLowerCase().indexOf(input) > -1);
  }

  onDropdownSelect(i: number, a: ReceiptArticle): void {
    (<HTMLInputElement>document.getElementById('receipt-article-' + i)).value = a.search;
  }

  select(receipt: Receipt) : void {
    this.busy = true;
    this.selectedReceipt = null;
    this.selectedTotals = { items: 0, discount: 0, deposit: 0, singleprice: 0, gross: 0 };
    let url: string = this.config.api.baseUrl + '/fin/receipt/' + receipt.id + '/items';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined && reply.payload['items']) {
        receipt.items = reply.payload['items'];
        receipt.items.forEach(i => {
          this.selectedTotals.items++;
          this.selectedTotals.deposit += i.deposit;
          this.selectedTotals.discount += i.discount;
          this.selectedTotals.singleprice += i.quantity * i.singleprice;
          this.selectedTotals.gross += i.totalnet;
        });
        this.selectedReceipt = receipt;
      }
      this.busy = false;
    });
  }

  taxrate(articleid: number): TaxRate|null {
    let article = this.article(articleid);
    if (article == null)
      return null;
    let filter = this.taxrates.filter(a => a.id == article?.taxrateid);
    if (filter.length === 1)
      return filter[0];
    return null;
  }

  update() : void {
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/fin/receipts';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <ReceiptsResponse>reply.payload;
        this.articles = response.articles.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0  });
        this.categories = response.categories.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0  });
        this.clients = response.clients.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0  });
        this.countries = response.countries.sort((a, b) => { return this.i18n('country.'+a.name) > this.i18n('country.'+b.name) ? 1 : this.i18n('country.'+a.name) < this.i18n('country.'+b.name) ? -1 : 0  });
        this.currencies = response.currencies.sort((a, b) => { return a.shortname > b.shortname ? 1 : a.shortname < b.shortname ? -1 : 0  });
        this.parties = response.parties.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0  });
        this.receipts = response.receipts.sort((a, b) => { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0  });
        this.taxrates = response.taxrates.sort((a, b) => { return a.rate < b.rate ? 1 : a.rate > b.rate ? -1 : 0  });
        this.currencies.forEach(c => c.isdefault ? this.defaultCurrency = c : null);
      }
      this.busy = false;
      setTimeout(() => { this.update(); }, 60000);
    });
  }

}

export interface ReceiptsResponse {
  articles: ReceiptArticle[];
  categories: ReceiptArticleCategory[];
  clients: Party[]; 
  countries: Country[]; 
  currencies: Currency[]; 
  parties: Party[]; 
  receipts: Receipt[];
  taxrates: TaxRate[];
}

export interface ReceiptTotals {
  items: number;
  discount: number;
  deposit: number;
  singleprice: number;
  gross: number;
}