import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { ToastsService } from 'src/app/utils/toasts.service';
import { Receipt, ReceiptArticle, ReceiptArticleCategory, TaxRate } from '../finance';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {

  activeArticleIndex: number = -1;
  activeArticleDropdownItems: ReceiptArticle[] = [];
  activeArticleDropdownPickIndex = -1;
  articles: ReceiptArticle[] = [];
  busy: boolean = false;
  categories: ReceiptArticleCategory[] = [];
  clients: Party[] = [];
  countries: Country[] = [];
  currencies: Currency[] = [];
  parties: Party[] = [];
  receipts: Receipt[] = [];
  taxrates: TaxRate[] = [];
  usersettingsObj: Settings | null = null;
  when: number = 0;

  defaultCurrency: Currency | null = null;
  selectedReceipt: Receipt | null = null;
  selectedTotals: ReceiptTotals = { items: 0, discount: 0, deposit: 0, singleprice: 0, gross: 0 };

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService,
    private toastService: ToastsService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  article(id: number): ReceiptArticle | null {
    let filter = this.articles.filter(a => a.id == id);
    if (filter.length === 1)
      return filter[0];
    return null;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  new(): void {
    if (this.defaultCurrency == null)
      return;
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

  onCancelEdit(): void {
    if (this.selectedReceipt) {
      this.selectedReceipt = null;
      this.selectedTotals = { items: 0, discount: 0, deposit: 0, singleprice: 0, gross: 0 };
    }
  }

  onChangeCurrency(): void {
    if (this.selectedReceipt && this.defaultCurrency) {
      this.selectedReceipt.currency = this.currencies.find((c) => c.id == +(this.selectedReceipt!.currencyid)) ?? this.defaultCurrency;
    }
  }

  onBeforeChangeInput(i: number, e: KeyboardEvent): void {
    if ((e.key === 'Enter' || e.code === 'Tab') && this.activeArticleDropdownPickIndex > -1 && this.activeArticleDropdownPickIndex < this.activeArticleDropdownItems.length) {
      this.onDropdownSelect(i, this.activeArticleDropdownItems[this.activeArticleDropdownPickIndex]);
      e.preventDefault();
      return;
    }
    if ((e.key === 'Enter' || e.code === 'Tab') && this.activeArticleDropdownItems.length == 1) {
      this.onDropdownSelect(i, this.activeArticleDropdownItems[0]);
      e.preventDefault();
      return;
    }
  }

  onAfterChangeInput(i: number, e: KeyboardEvent): void {
    if (e.code === 'NumpadMultiply') {
      (<HTMLInputElement>e.target).value = '';
      this.activeArticleDropdownItems = [];
      return;
    }
    if (e.code === 'ArrowDown') {
      if (this.activeArticleDropdownItems.length > 0 && this.activeArticleDropdownItems.length > this.activeArticleDropdownPickIndex + 1)
        this.activeArticleDropdownPickIndex += 1;
      return;
    }
    if (e.code === 'ArrowUp') {
      if (this.activeArticleDropdownItems.length > 0 && this.activeArticleDropdownPickIndex > -1)
        this.activeArticleDropdownPickIndex -= 1;
      return;
    }
    let input: string = (<HTMLInputElement>e.target).value.toLowerCase();
    // 1. match exact, 2. match start, 3. match containing
    let items = this.articles.filter((a) => a.search.toLowerCase() === input);
    items = items.concat(this.articles.filter((a) => items.indexOf(a) === -1 && a.search.toLowerCase().indexOf(input) === 0));
    items = items.concat(this.articles.filter((a) => items.indexOf(a) === -1 && (a.name.toLowerCase().indexOf(input) > 0 || a.search.toLowerCase().indexOf(input) > 0)));
    if (items.length > 5)
      items = items.slice(0, 5);
    this.activeArticleDropdownPickIndex = -1;
    this.activeArticleDropdownItems = items;
  }

  onChangeValues(i: number): void {
    if (this.selectedReceipt) {
      this.selectedReceipt.items[i].totalnet = +(this.selectedReceipt.items[i].quantity * this.selectedReceipt.items[i].singleprice + this.selectedReceipt.items[i].deposit - this.selectedReceipt.items[i].discount).toFixed(2);
      this.selectedReceipt.gross_total = this.selectedReceipt.items.reduce((a, o) => { return a + o.totalnet; }, 0);
      this.selectedTotals.items = this.selectedReceipt.items.length;
      this.selectedTotals.deposit = this.selectedReceipt.items.reduce((a, o) => { return a + o.deposit; }, 0);
      this.selectedTotals.discount = this.selectedReceipt.items.reduce((a, o) => { return a + o.discount; }, 0);
      this.selectedTotals.singleprice = this.selectedReceipt.items.reduce((a, o) => { return a + (o.quantity * o.singleprice); }, 0);
      this.selectedTotals.gross = this.selectedReceipt.gross_total;
    }
  }

  onDropdownSelect(i: number, a: ReceiptArticle): void {
    (<HTMLInputElement>document.getElementById('receipt-article-' + i)).value = a.search;
    this.selectedReceipt!.items[i].articleid = a.id;
    this.activeArticleIndex = -1;
    this.activeArticleDropdownItems = [];
    this.onChangeValues(i);
    this.newItem();
    document.getElementById('receipt-quantity-' + i)?.focus();
  }

  onKeydownValue(i: number, e: KeyboardEvent) : void {
    if (e.code === 'NumpadAdd') {
      document.getElementById('receipt-article-' + (i + 1))?.focus();
      e.preventDefault();
      return;
    }
  }

  saveSelected(form: any, e: any): void {
    if (!this.selectedReceipt)
      return;
    if (form.form.status !== 'VALID') {
      this.toastService.warn(this.i18nService.i18n('common.warn.formInvalid.title'),
        this.i18nService.i18n('common.warn.formInvalid.message'));
      return;
    }

    if (this.selectedReceipt.items.length == 0) {
      this.toastService.warn(this.i18nService.i18n('common.warn.formInvalid.title'),
        this.i18nService.i18n('receipts.edit.noitems1'));
      return;
    }

    if (this.selectedReceipt.items[0].articleid == null || this.selectedReceipt.items[0].totalnet == 0) {
      this.toastService.warn(this.i18nService.i18n('common.warn.formInvalid.title'),
        this.i18nService.i18n('receipts.edit.noitems2'));
      return;
    }

    let payload = {
      date: this.selectedReceipt.date,
      clientid: this.selectedReceipt.clientid,
      currencyid: this.selectedReceipt.currencyid,
      partyid: this.selectedReceipt.partyid,
      items: this.selectedReceipt.items
    };

    let url: string = this.config.api.baseUrl + '/fin/receipt/create';
    this.authService.updateApi(url, payload).subscribe((reply) => {
      if (reply.success && reply.payload) {
        let newreceipt: Receipt = <Receipt>reply.payload['receipt'];
        this.update_addReceipt(newreceipt);
        this.receipts.sort((a, b) => { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0 });
        this.new();
        this.newItem();
      }
    });

  }

  select(receipt: Receipt): void {
    if (this.selectedReceipt) {
      if (this.selectedReceipt.id == 0 && this.selectedReceipt.items.length > 1) {
        this.toastService.warn(this.i18nService.i18n('receipts.select.stillediting.title'),
          this.i18nService.i18n('receipts.select.stillediting.message'));
        return;
      }
    }
    this.busy = true;
    this.selectedReceipt = null;
    this.selectedTotals = { items: 0, discount: 0, deposit: 0, singleprice: 0, gross: 0 };
    this.selectedReceipt = receipt;
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
      }
      this.busy = false;
    });
  }

  taxrate(articleid: number): TaxRate | null {
    let article = this.article(articleid);
    if (article == null)
      return null;
    let filter = this.taxrates.filter(a => a.id == article?.taxrateid);
    if (filter.length === 1)
      return filter[0];
    return null;
  }

  update(): void {
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/fin/receipts' + (this.when > 0 ? '/' + this.when : '');
    let clean = this.when == 0;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <ReceiptsResponse>reply.payload;
        if (clean) {
          this.articles = response.articles.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 });
          this.categories = response.categories.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 });
          this.clients = response.clients.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0 });
          this.countries = response.countries.sort((a, b) => { return this.i18n('country.' + a.name) > this.i18n('country.' + b.name) ? 1 : this.i18n('country.' + a.name) < this.i18n('country.' + b.name) ? -1 : 0 });
          this.currencies = response.currencies.sort((a, b) => { return a.shortname > b.shortname ? 1 : a.shortname < b.shortname ? -1 : 0 });
          this.parties = response.parties.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0 });
          this.receipts = response.receipts.sort((a, b) => { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0 });
          this.taxrates = response.taxrates.sort((a, b) => { return a.rate < b.rate ? 1 : a.rate > b.rate ? -1 : 0 });
        } else {

          response.articles.forEach((a) => { this.update_addArticle(a); });
          if (response.articles.length > 0)
            this.articles.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 });

          response.categories.forEach((a) => { this.update_addCategory(a); });
          if (response.categories.length > 0)
            this.categories.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 });

          response.clients.forEach((a) => { this.update_addClient(a); });
          if (response.clients.length > 0)
            this.clients.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0 });

          response.countries.forEach((a) => { this.update_addCountry(a); });
          if (response.countries.length > 0)
            this.countries.sort((a, b) => { return this.i18n('country.' + a.name) > this.i18n('country.' + b.name) ? 1 : this.i18n('country.' + a.name) < this.i18n('country.' + b.name) ? -1 : 0 });

          response.currencies.forEach((a) => { this.update_addCurrency(a); });
          if (response.currencies.length > 0)
            this.currencies.sort((a, b) => { return a.shortname > b.shortname ? 1 : a.shortname < b.shortname ? -1 : 0 });

          response.parties.forEach((a) => { this.update_addParty(a); });
          if (response.parties.length > 0)
            this.parties.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0 });

          response.receipts.forEach((a) => { this.update_addReceipt(a); });
          if (response.receipts.length > 0)
            this.receipts.sort((a, b) => { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0 });

          response.taxrates.forEach((a) => { this.update_addTaxrate(a); });
          if (response.taxrates.length > 0)
            this.taxrates.sort((a, b) => { return a.rate < b.rate ? 1 : a.rate > b.rate ? -1 : 0 });

        }
        this.currencies.forEach((c) => {
          if (c.isdefault && (!this.defaultCurrency || c.id != this.defaultCurrency.id))
            this.defaultCurrency = c;
        });
      }
      this.busy = false;
      this.userSettings.setTimeout(setTimeout(() => { this.update(); }, 1500));
    });
  }

  update_addArticle(article: ReceiptArticle): void {
    let changeindex = -1;
    for (let i = 0; i < this.articles.length - 1; i++) {
      if (this.articles[i].id == article.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.articles[changeindex] = article;
    else
      this.articles.push(article);
  }

  update_addCategory(cat: ReceiptArticleCategory): void {
    let changeindex = -1;
    for (let i = 0; i < this.categories.length - 1; i++) {
      if (this.categories[i].id == cat.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.categories[changeindex] = cat;
    else
      this.categories.push(cat);
  }

  update_addClient(client: Party): void {
    let changeindex = -1;
    for (let i = 0; i < this.clients.length - 1; i++) {
      if (this.clients[i].id == client.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.clients[changeindex] = client;
    else
      this.clients.push(client);
  }

  update_addCountry(country: Country): void {
    let changeindex = -1;
    for (let i = 0; i < this.countries.length - 1; i++) {
      if (this.countries[i].id == country.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.countries[changeindex] = country;
    else
      this.countries.push(country);
  }

  update_addCurrency(currency: Currency): void {
    let changeindex = -1;
    for (let i = 0; i < this.currencies.length - 1; i++) {
      if (this.currencies[i].id == currency.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.currencies[changeindex] = currency;
    else
      this.currencies.push(currency);
  }

  update_addParty(party: Party): void {
    let changeindex = -1;
    for (let i = 0; i < this.parties.length - 1; i++) {
      if (this.parties[i].id == party.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.parties[changeindex] = party;
    else
      this.parties.push(party);
  }

  update_addReceipt(receipt: Receipt): void {
    let changeindex = -1;
    for (let i = 0; i < this.receipts.length - 1; i++) {
      if (this.receipts[i].id == receipt.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.receipts[changeindex] = receipt;
    else
      this.receipts.push(receipt);
  }

  update_addTaxrate(rate: TaxRate): void {
    let changeindex = -1;
    for (let i = 0; i < this.taxrates.length - 1; i++) {
      if (this.taxrates[i].id == rate.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.taxrates[changeindex] = rate;
    else
      this.taxrates.push(rate);
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