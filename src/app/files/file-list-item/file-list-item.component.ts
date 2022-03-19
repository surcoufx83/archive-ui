import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { File, Version } from '../file';
import * as _filesize from 'filesize';
import { AppConfig, ConfigService } from 'src/app/config.service';

@Component({
  selector: 'file-list-item',
  templateUrl: './file-list-item.component.html',
  styleUrls: ['./file-list-item.component.scss']
})
export class FileListItemComponent {

  @Input() file!: File;
  @Input() relevance: number|null = null;
  @Input() showButtons: boolean = true;
  @Output() downloadClicked = new EventEmitter();
  @Output() clicked = new EventEmitter();
  @Output() previewClicked = new EventEmitter();

  constructor(private configService: ConfigService, private i18nService: I18nService) { }

  click() : void {
    this.clicked.emit();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  download() : void {
    this.downloadClicked.emit();
  }

  filesize(size: number) : string {
    return _filesize(size);
  }

  fn(n: number, fd: number = 0) : string {
    return this.i18nService.formatNumber(n, {minimumFractionDigits: fd})
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  preview() : void {
    this.previewClicked.emit();
  }

  get version() : Version|null {
    if (Object.keys(this.file.versions).length > 0) {
      let key = +(Object.keys(this.file.versions)[Object.keys(this.file.versions).length-1]);
      return this.file.versions[key];
    }
    return null;
  }

}
