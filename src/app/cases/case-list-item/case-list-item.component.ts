import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import * as _filesize from 'filesize';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { Case } from '../case';

@Component({
  selector: 'case-list-item',
  templateUrl: './case-list-item.component.html',
  styleUrls: ['./case-list-item.component.scss']
})
export class CaseListItemComponent {

  @Input() case!: Case;
  @Input() relevance: number|null = null;
  @Output() clicked = new EventEmitter();

  constructor(private configService: ConfigService, private i18nService: I18nService) { }

  click() : void {
    this.clicked.emit();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  fn(n: number, fd: number = 0) : string {
    return this.i18nService.formatNumber(n, {minimumFractionDigits: fd})
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

}
