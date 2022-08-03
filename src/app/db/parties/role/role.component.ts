import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PartyRole } from 'src/app/common';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class DbRoleComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  saving: boolean = false;
  roles: PartyRole[] = [];
  editrole?: PartyRole;
  usersettingsObj: Settings | null = null;
  sortAsc: boolean = true;
  sortBy: string = 'i18nname';
  storagename: string = this.config.storage.prefix + 'dbrolesData';
  timeout: any;
  when: number = 0;

  constructor(private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService) {
    let olddata: string | null | DbRolesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      this.roles = (<DbRolesStorage>JSON.parse(olddata)).items;
      this.sort();
    }
    this.userSettings.loadArchiveSettings();
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.roles$.subscribe((roles) => {/*
      if (roles.length == 0)
        return;
      this.roles = roles;
      this.roles.forEach((item) => { item.i18nname = this.i18n('partyroles.' + item.name) });
      this.sort();
      localStorage.setItem(this.storagename, JSON.stringify({ items: this.roles }));*/
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  delete(item: PartyRole) {
    if (confirm(this.i18n('common.confirm.askDeletion', [item.name]))) {
      this.saving = true;
      this.userSettings.deleteRole(item).subscribe((e) => {
        if (e) {
          this.toastService.confirm(this.i18nService.i18n('common.confirm.delete.title'),
            this.i18nService.i18n('common.confirm.delete.message'));
          this.editrole = undefined;
        }
        this.saving = false;
      });
    }
  }

  edit(item?: PartyRole): void {
    if (item)
      this.editrole = item;
    else
      this.editrole = {
        id: 0, name: '', i18nname: '',
        created: '', modified: '', deleted: null
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
        this.roles.sort((a, b) => { return (a.i18nname > b.i18nname ? 1 : a.i18nname < b.i18nname ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'name';
        this.roles.sort((a, b) => { return (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) * (this.sortAsc ? 1 : -1) });
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
    if (!this.editrole)
      return;
    this.saving = true;
    this.userSettings.updateRole(this.editrole).subscribe((e) => {
      if (e)
        this.toastService.confirm(this.i18nService.i18n('common.confirm.save.title'),
          this.i18nService.i18n('common.confirm.save.message'));
      this.saving = false;
    });
  }

}

export interface DbRolesStorage {
  items: PartyRole[]
}
