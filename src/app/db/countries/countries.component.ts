import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Currency } from 'src/app/account/account';
import { Country } from 'src/app/common';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class DbCountriesComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  saving: boolean = false;
  countries: Country[] = [];
  editcountry?: Country;
  currencies: Currency[] = [];
  usersettingsObj: Settings | null = null;
  sortAsc: boolean = true;
  sortBy: string = 'i18nname';
  timeout: any;

  constructor(private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService) {
    this.userSettings.loadArchiveSettings();
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.countries$.subscribe((countries) => {
      this.countries = countries;
      this.countries.forEach((item) => { item.i18nname = this.i18n('country.' + item.name) });
      this.sort();
    });
    this.userSettings.currencies$.subscribe((currencies) => {
      this.currencies = currencies;
      this.currencies.sort((a, b) => { return ((a.isdefault && !b.isdefault ? -1 : !a.isdefault && b.isdefault ? 1 : 0) || a.shortname.localeCompare(b.shortname)) });
    });
    this.edit();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  edit(item?: Country): void {
    if (item)
      this.editcountry = item;
    else
      this.editcountry = {
        id: 0, currency: null, currencyid: null, name: '',
        key2: '', key3: '', isdefault: false, i18nname: ''
      };
    if (this.editor && this.editor.nativeElement) {
      window.scrollTo(0, this.editor.nativeElement.offsetTop - 64);
    }
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
  }

  sort(): void {
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
    if (!this.editcountry)
      return;
    this.saving = true;
    this.userSettings.updateCountry(this.editcountry).subscribe((e) => {
      if (e)
        this.toastService.confirm(this.i18nService.i18n('common.confirm.save.title'),
          this.i18nService.i18n('common.confirm.save.message'));
      this.saving = false;
    });
  }

}