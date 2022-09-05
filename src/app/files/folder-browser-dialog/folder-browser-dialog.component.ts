import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ButtonType } from 'src/app/common';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Directory, File } from '../file';

@Component({
  selector: 'folder-browser-dialog',
  templateUrl: './folder-browser-dialog.component.html',
  styleUrls: ['./folder-browser-dialog.component.scss']
})
export class FolderBrowserDialogComponent implements OnInit {

  busy: boolean = false;
  dir!: Directory;
  file: File | null = null;
  files: File[] = [];
  folders: Directory[] = [];
  @Input() initialFolder: Directory | null = null;
  @Input() showDirectories: boolean = true;
  @Input() showFiles: boolean = false;
  @Input() showAddFolderBtn: boolean = false;
  @Input() cancelBtnTitle: string = this.i18nService.i18n('common.cancel');
  @Input() okBtnTitle: string = this.i18nService.i18n('common.save');
  @Input() title: string = this.i18nService.i18n('folderbrowser.title');
  @Output() select = new EventEmitter<SelectedItem>();
  @ViewChild('modal') modal?: ElementRef;

  newfolderClicked: boolean = false;
  newfolderName: string = '';

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService) { }

  cancel(): void {
    this.select.emit({
      clickedButton: ButtonType.Cancel,
      selectedFile: null,
      selectedFolder: null,
    });
  }

  cancelNewFolder() : void {
    this.newfolderClicked = false;
    this.newfolderName = '';
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
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
    let url = this.configService.config.api.baseUrl + '/directories/' + this.dir.id + '/ls';
    this.authService.updateApi(url, {
      directories: this.showDirectories,
      files: this.showFiles
    }).subscribe((reply) => {
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
    let url = this.configService.config.api.baseUrl + '/directories/' + this.dir.id + '/mkdir';
    this.busy = true;
    this.authService.updateApi(url, {
      name: this.newfolderName
    }).subscribe((reply) => {
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