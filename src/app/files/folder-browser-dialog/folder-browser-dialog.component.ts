import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { ButtonType, Directory, File } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'folder-browser-dialog',
  templateUrl: './folder-browser-dialog.component.html',
  styleUrls: ['./folder-browser-dialog.component.scss']
})
export class FolderBrowserDialogComponent implements OnInit {

  @Input() cancelBtnTitle: string = this.i18nstr.common.cancel;
  @Input() initialFolder: Directory | null = null;
  @Input() okBtnTitle: string = this.i18nstr.common.save;
  @Input() showAddFolderBtn: boolean = false;
  @Input() showDirectories: boolean = true;
  @Input() showFiles: boolean = false;
  @Input() title: string = this.i18nstr.folderbrowser.title;
  @Output() select = new EventEmitter<SelectedItem>();
  @ViewChild('modal') modal?: ElementRef;

  busy: boolean = false;
  dir!: Directory;
  file: File | null = null;
  files: File[] = [];
  folders: Directory[] = [];
  icons = environment.icons;
  newfolderClicked: boolean = false;
  newfolderName: string = '';

  constructor(
    private authService: AuthService,
    private i18nService: I18nService
  ) { }

  cancel(): void {
    this.select.emit({
      clickedButton: ButtonType.Cancel,
      selectedFile: null,
      selectedFolder: null,
    });
  }

  cancelNewFolder(): void {
    this.newfolderClicked = false;
    this.newfolderName = '';
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

  ngOnInit(): void {
    if (this.initialFolder == null) {
      this.cancel();
      return;
    }
    this.dir = this.initialFolder;
    this.reload();
  }

  reload(): void {
    this.cancelNewFolder();
    this.files = [];
    this.folders = [];
    this.busy = true;
    let url = `${environment.api.baseUrl}/directories/${this.dir.id}/ls`;
    this.authService.updateApi(url, {
      directories: this.showDirectories,
      files: this.showFiles
    }).pipe(first()).subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['items']) {
        this.files = (<File[]>reply.payload['items']['files']).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0);
        this.folders = (<Directory[]>reply.payload['items']['subdirs']).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0);
      }
      else
        alert("Error calling API :(");
      this.busy = false;
    });
  }

  saveNewFolder(): void {
    if (this.newfolderName == '')
      return;
    let url = `${environment.api.baseUrl}/directories/${this.dir.id}/mkdir`;
    this.busy = true;
    this.authService.updateApi(url, {
      name: this.newfolderName
    }).pipe(first()).subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['dir']) {
        this.dir = <Directory>reply.payload['dir'];
        this.reload();
      }
      else
        alert("Error calling API :(");
      this.busy = false;
    });
  }

  submit(): void {
    this.select.emit({
      clickedButton: ButtonType.Ok,
      selectedFile: this.file ?? null,
      selectedFolder: this.file == null ? this.dir : null,
    });
  }

}

export interface SelectedItem {
  selectedFile: File | null;
  selectedFolder: Directory | null;
  clickedButton: ButtonType;
}