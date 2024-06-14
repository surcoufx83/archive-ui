import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { PartyRole, UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/utils/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class DbRoleComponent implements OnDestroy, OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  editrole?: PartyRole;
  icons = environment.icons;
  roles: PartyRole[] = [];
  saving: boolean = false;
  sortAsc: boolean = true;
  sortBy: string = 'i18nname';
  storagename: string = `${environment.localStoragePrefix}dbrolesData`;
  subscriptions: Subscription[] = [];
  timeout: any;
  usersettingsObj: UserSettings | null = null;
  when: number = 0;

  constructor(
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService
  ) {
    this.userSettings.loadArchiveSettings();
  }

  delete(item: PartyRole) {
    if (confirm(this.i18n('common.confirm.askDeletion', [item.name]))) {
      this.saving = true;
      this.userSettings.deleteRole(item).pipe(first()).subscribe((e) => {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.roles$.subscribe((roles) => {
      this.roles = Object.values(roles);
      this.roles.forEach((item) => { item.i18nname = this.i18n('partyroles.' + item.name) });
      this.sort();
    }));
  }

  sort(field?: string, asc?: boolean): void {
    if (field != undefined)
      this.sortBy = field;
    if (asc != undefined)
      this.sortAsc = asc;
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
    this.userSettings.updateRole(this.editrole).pipe(first()).subscribe((e) => {
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
