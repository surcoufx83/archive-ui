import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { Currency, UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/utils/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class DbCurrenciesComponent implements OnDestroy, OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  currencies: Currency[] = [];
  editcurrency?: Currency;
  icons = environment.icons;
  saving: boolean = false;
  sortAsc: boolean = true;
  sortBy: string = 'i18nname';
  storagename: string = `${environment.localStoragePrefix}dbcurrenciesData`;
  subscriptions: Subscription[] = [];
  timeout: any;
  usersettingsObj: UserSettings | null = null;
  when: number = 0;

  constructor(
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService
  ) {
    let olddata: string | null | DbCurrenciesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      this.currencies = (<DbCurrenciesStorage>JSON.parse(olddata)).items;
      this.sort();
    }
    this.userSettings.loadArchiveSettings();

  }

  delete(item: Currency) {
    if (confirm(this.i18n('common.confirm.askDeletion', [item.name]))) {
      this.saving = true;
      this.userSettings.deleteCurrency(item).pipe(first()).subscribe((e) => {
        if (e) {
          this.toastService.confirm(this.i18nService.i18n('common.confirm.delete.title'),
            this.i18nService.i18n('common.confirm.delete.message'));
          this.editcurrency = undefined;
        }
        this.saving = false;
      });
    }
  }

  edit(item?: Currency): void {
    if (item)
      this.editcurrency = item;
    else
      this.editcurrency = {
        id: 0, isdefault: false, name: '', shortname: '', sign: ''
      };
    if (this.editor && this.editor.nativeElement) {
      window.scrollTo(0, this.editor.nativeElement.offsetTop - 64);
    }
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.currencies$.subscribe((currencies) => {
      if (currencies.length == 0)
        return;
      this.currencies = currencies;
      this.sort();
      localStorage.setItem(this.storagename, JSON.stringify({ items: this.currencies }));
    }));
  }

  sort(field?: string, asc?: boolean): void {
    if (field != undefined)
      this.sortBy = field;
    if (asc != undefined)
      this.sortAsc = asc;
    switch (this.sortBy) {

      case 'shortname':
        this.currencies.sort((a, b) => { return (a.shortname > b.shortname ? 1 : a.shortname < b.shortname ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      case 'sign':
        this.currencies.sort((a, b) => { return (a.sign > b.sign ? 1 : a.sign < b.sign ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'name';
        this.currencies.sort((a, b) => { return (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) * (this.sortAsc ? 1 : -1) });
    }
  }

  submit(form: NgForm): void {
    if (!form.valid) {
      this.toastService.warn(this.i18nService.i18n('common.warn.formInvalid.title'),
        this.i18nService.i18n('common.warn.formInvalid.message'));
      return;
    }
    if (!this.timeout)
      window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.sendUpdate(), 500);
  }

  private sendUpdate(): void {
    if (!this.editcurrency)
      return;
    this.saving = true;
    this.userSettings.updateCurrency(this.editcurrency).pipe(first()).subscribe((e) => {
      if (e)
        this.toastService.confirm(this.i18nService.i18n('common.confirm.save.title'),
          this.i18nService.i18n('common.confirm.save.message'));
      this.saving = false;
    });
  }

}

export interface DbCurrenciesStorage {
  items: Currency[]
}
