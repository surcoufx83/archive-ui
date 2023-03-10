import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Extension, Mimetype } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { ToastsService } from 'src/app/utils/toasts.service';

export const newFileextension: Extension = {
  id: 0,
  displayable: false,
  downloadable: true,
  ext: '',
  indexable: false,
  mimetype: '',
  mimetypemeta: null,
  phpoffice: false,
  convert: {
    gscommand: '',
    ocrcommand: '',
    returnImg: false,
    returnMimetype: '',
  },
  meta: {
    nocase: false,
    noclass: false,
  }
};

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html',
  styleUrls: ['./extensions.component.scss']
})
export class DbExtensionsComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  saving: boolean = false;
  extensions: Extension[] = [];
  edititem?: Extension;
  mimetypes: Mimetype[] = [];
  mimetypeIds: { [key: number]: number } = {};
  mimetypeNames: { [key: string]: number } = {};
  sortAsc: boolean = true;
  sortBy: string = 'ext';
  timeout: any;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private toastService: ToastsService) { }

  get config(): AppConfig {
    return this.configService.config;
  }

  delete(item: Extension) {
    if (confirm(this.i18n('common.confirm.askDeletion', [item.ext]))) {
      this.saving = true;

    }
  }

  edit(item?: Extension): void {
    if (item)
      this.edititem = { ...item };
    else
      this.edititem = { ...newFileextension };
    if (this.editor && this.editor.nativeElement) {
      window.scrollTo(0, this.editor.nativeElement.offsetTop - 64);
    }
  }

  get displayableIcon(): string {
    return this.config.icons['preview'];
  }

  get downloadableIcon(): string {
    return this.config.icons['download'];
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get indexableIcon(): string {
    return this.config.icons['fingerprint'];
  }

  ngOnInit(): void {
    let url: string = `${this.config.api.baseUrl}/extensions`;
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        if (reply.payload['extensions'] != undefined) {
          this.extensions = <Extension[]>reply.payload['extensions'];
          this.sort();
        }
        if (reply.payload['mimetypes'] != undefined) {
          this.mimetypes = (<Mimetype[]>reply.payload['mimetypes']).sort((a, b) => a.mimetype.toLocaleLowerCase() > b.mimetype.toLocaleLowerCase() ? 1 : -1);
          let ids: { [key: number]: number } = {};
          let names: { [key: string]: number } = {};
          for (let i = 0; i < this.mimetypes.length; i++) {
            ids[this.mimetypes[i].id] = i;
            names[this.mimetypes[i].mimetype] = i;
          }
          this.mimetypeIds = ids;
          this.mimetypeNames = names;
        }
      }
    });
  }

  sort(field?: string, asc?: boolean): void {
    if (field != undefined)
      this.sortBy = field;
    if (asc != undefined)
      this.sortAsc = asc;
    switch (this.sortBy) {
      case 'mimetype':
        this.extensions.sort((a, b) => { return (a.mimetype.toLocaleLowerCase() > b.mimetype.toLocaleLowerCase() ? 1 : a.mimetype.toLocaleLowerCase() < b.mimetype.toLocaleLowerCase() ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'ext';
        this.extensions.sort((a, b) => { return (a.ext > b.ext ? 1 : a.ext < b.ext ? -1 : 0) * (this.sortAsc ? 1 : -1) });
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
    if (!this.edititem)
      return;
    this.saving = true;
    this.authService.updateApi2(`extension/${this.edititem.id}`, { ext: this.edititem }).subscribe((reply) => {
      if (reply.success && reply.payload != undefined && reply.payload['ext'] != undefined) {
        this.edititem = <Extension>reply.payload['ext'];
        this.extensions.forEach((ext, i) => {
          if (ext.id == this.edititem!.id)
            this.extensions[i] = { ...this.edititem! };
        })
      }
      this.saving = false;
    });
  }

}