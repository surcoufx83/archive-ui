import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import * as _filesize from 'filesize';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { Case } from '../case';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'case-list-item',
  templateUrl: './case-list-item.component.html',
  styleUrls: ['./case-list-item.component.scss']
})
export class CaseListItemComponent {

  @Input() case!: Case;
  @Input() gotoButton: boolean = false;
  @Input() relevance: number|null = null;
  @Output() clicked = new EventEmitter();
  @Output() gotoClicked = new EventEmitter();

  constructor(private configService: ConfigService, private i18nService: I18nService, public formatService: FormatService) { }

  btnClick() : void {
    this.gotoClicked.emit();
  }

  click() : void {
    this.clicked.emit();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: any[] = [], i: number = 0): string {
    return this.i18nService.i18n(key, params, i);
  }

}
