import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { Country, Currency, TaxRate, UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/utils/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';
import { environment } from 'src/environments/environment.dev';
import { DbCurrenciesStorage } from './currencies/currencies.component';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class DbCountriesComponent implements OnInit, OnDestroy {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  countries: Country[] = [];
  currencies: Currency[] = [];
  editcountry?: Country;
  icons = environment.icons;
  saving: boolean = false;
  sortAsc: boolean = true;
  sortBy: string = 'i18nname';
  storagename: string = `${environment.localStoragePrefix}dbcountriesData`;
  storagenameCurrency: string = `${environment.localStoragePrefix}dbcurrenciesData`;
  subscriptions: Subscription[] = [];
  timeout: any;
  usersettingsObj: UserSettings | null = null;
  when: number = 0;

  constructor(
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService
  ) {
    let olddata: string | null | DbCountriesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      this.countries = (<DbCountriesStorage>JSON.parse(olddata)).items;
      this.sort();
    }
    let olddata2: string | null | DbCurrenciesStorage = localStorage.getItem(this.storagenameCurrency);
    if (olddata2) {
      this.currencies = (<DbCurrenciesStorage>JSON.parse(olddata2)).items;
      this.sortCurrencies();
    }
    this.userSettings.loadArchiveSettings();

  }

  delete(item: Country) {
    if (confirm(this.i18n('common.confirm.askDeletion', [item.name]))) {
      this.saving = true;
      this.userSettings.deleteCountry(item).pipe(first()).subscribe((e) => {
        console.log(e)
        if (e) {
          this.toastService.confirm(this.i18nstr.common.confirm.delete.title,
            this.i18nstr.common.confirm.delete.message);
          this.editcountry = undefined;
        }
        this.saving = false;
      });
    }
  }

  edit(item?: Country): void {
    if (item)
      this.editcountry = item;
    else
      this.editcountry = {
        id: 0, currency: null, currencyid: null, name: '',
        key2: '', key3: '', isdefault: false, i18nname: '', taxrates: []
      };
    if (this.editor && this.editor.nativeElement) {
      window.scrollTo(0, this.editor.nativeElement.offsetTop - 64);
    }
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
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.countries$.subscribe((countries) => {
      if (countries.length == 0)
        return;
      this.countries = countries;
      this.countries.forEach((item) => { item.i18nname = this.i18n('country.' + item.name); item.taxrates = this.sortTaxRates(item.taxrates) });
      this.sort();
      localStorage.setItem(this.storagename, JSON.stringify({ items: this.countries }));
    }));
    this.subscriptions.push(this.userSettings.currencies$.subscribe((currencies) => {
      if (currencies.length == 0)
        return;
      this.currencies = currencies;
      this.sortCurrencies();
    }));
  }

  sort(field?: string, asc?: boolean): void {
    if (field != undefined)
      this.sortBy = field;
    if (asc != undefined)
      this.sortAsc = asc;
    switch (this.sortBy) {

      case 'i18nname':
        this.countries.sort((a, b) => { return (a.i18nname > b.i18nname ? 1 : a.i18nname < b.i18nname ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      case 'key2':
        this.countries.sort((a, b) => { return (a.key2 > b.key2 ? 1 : a.key2 < b.key2 ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      case 'key3':
        this.countries.sort((a, b) => { return (a.key3 > b.key3 ? 1 : a.key3 < b.key3 ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'name';
        this.countries.sort((a, b) => { return (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) * (this.sortAsc ? 1 : -1) });
    }
  }

  sortCurrencies(): void {
    this.currencies.sort((a, b) => { return ((a.isdefault && !b.isdefault ? -1 : !a.isdefault && b.isdefault ? 1 : 0) || a.shortname.localeCompare(b.shortname)) });
    localStorage.setItem(this.storagenameCurrency, JSON.stringify({ items: this.currencies }));
  }

  sortTaxRates(items: TaxRate[]): TaxRate[] {
    return items.sort((a, b) => { return ((a.validfrom ?? '') > (b.validfrom ?? '') ? 1 : ((a.validuntil ?? '') > (b.validuntil ?? '') ? 1 : (a.rate > b.rate ? 1 : -1))) })
  }

  submit(form: NgForm): void {
    if (!form.valid) {
      this.toastService.warn(this.i18nstr.common.warn.formInvalid.title,
        this.i18nstr.common.warn.formInvalid.message);
      return;
    }
    if (!this.timeout)
      window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.sendUpdate(), 500);
  }

  private sendUpdate(): void {
    if (!this.editcountry)
      return;
    this.saving = true;
    this.userSettings.updateCountry(this.editcountry).pipe(first()).subscribe((e) => {
      if (e)
        this.toastService.confirm(this.i18nstr.common.confirm.save.title,
          this.i18nstr.common.confirm.save.message);
      this.saving = false;
    });
  }

}

export interface DbCountriesStorage {
  items: Country[]
}
