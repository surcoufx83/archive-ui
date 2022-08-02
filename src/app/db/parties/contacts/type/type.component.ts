import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactType } from 'src/app/common';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class DbContactTypeComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  saving: boolean = false;
  ctypes: ContactType[] = [];
  editctype?: ContactType;
  usersettingsObj: Settings | null = null;
  sortAsc: boolean = true;
  sortBy: string = 'i18nname';
  storagename: string = this.config.storage.prefix + 'dbctypesData';
  timeout: any;
  when: number = 0;

  constructor(private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService) {
    let olddata: string | null | DbTypesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      this.ctypes = (<DbTypesStorage>JSON.parse(olddata)).items;
      this.sort();
    }
    this.userSettings.loadArchiveSettings();
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.contacttypes$.subscribe((ctypes) => {
      if (ctypes.length == 0)
        return;
      this.ctypes = ctypes;
      this.ctypes.forEach((item) => { item.i18nname = this.i18n('contacttypes.' + item.name) });
      this.sort();
      localStorage.setItem(this.storagename, JSON.stringify({ items: this.ctypes }));
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  delete(item: ContactType) {
    if (confirm(this.i18n('common.confirm.askDeletion', [item.name]))) {
      this.saving = true;
      this.userSettings.deleteContactType(item).subscribe((e) => {
        if (e) {
          this.toastService.confirm(this.i18nService.i18n('common.confirm.delete.title'),
            this.i18nService.i18n('common.confirm.delete.message'));
          this.editctype = undefined;
        }
        this.saving = false;
      });
    }
  }

  edit(item?: ContactType): void {
    if (item)
      this.editctype = item;
    else
      this.editctype = {
        id: 0, name: '', i18nname: '', icon: ''
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
        this.ctypes.sort((a, b) => { return (a.i18nname > b.i18nname ? 1 : a.i18nname < b.i18nname ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'name';
        this.ctypes.sort((a, b) => { return (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) * (this.sortAsc ? 1 : -1) });
    }
    console.log(this.ctypes);
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
    if (!this.editctype)
      return;
    this.saving = true;
    this.userSettings.updateContactType(this.editctype).subscribe((e) => {
      if (e)
        this.toastService.confirm(this.i18nService.i18n('common.confirm.save.title'),
          this.i18nService.i18n('common.confirm.save.message'));
      this.saving = false;
    });
  }

}

export interface DbTypesStorage {
  items: ContactType[]
}