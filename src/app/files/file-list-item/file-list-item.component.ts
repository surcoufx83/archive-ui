import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { File, Version } from 'src/app/if';
import { FileService } from 'src/app/utils/file.service';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'file-list-item',
  templateUrl: './file-list-item.component.html',
  styleUrls: ['./file-list-item.component.scss']
})
export class FileListItemComponent {

  @Input() file!: File;
  @Input() gotoButton: boolean = false;
  @Input() relevance: number|null = null;
  @Input() showButtons: boolean = true;
  @Output() downloadClicked = new EventEmitter();
  @Output() clicked = new EventEmitter();
  @Output() previewClicked = new EventEmitter();

  constructor(private configService: ConfigService, private i18nService: I18nService, public formatService: FormatService, private fileService: FileService) { }

  click() : void {
    this.clicked.emit();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  download() : void {
    this.downloadClicked.emit();
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  preview() : void {
    this.previewClicked.emit();
  }

  get version() : Version|null {
    return this.fileService.version(this.file);
  }

}
