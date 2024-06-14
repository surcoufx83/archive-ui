import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { Case, CaseStatus, CaseType } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'case-list-item',
  templateUrl: './case-list-item.component.html',
  styleUrls: ['./case-list-item.component.scss']
})
export class CaseListItemComponent {

  @Input() case!: Case;
  @Input() gotoButton: boolean = false;
  @Input() relevance: number | null = null;
  @Output() clicked = new EventEmitter();
  @Output() gotoClicked = new EventEmitter();

  icons = environment.icons;

  constructor(
    private i18nService: I18nService,
    public formatService: FormatService,
    private settingsService: SettingsService
  ) { }

  btnClick(): void {
    this.gotoClicked.emit();
  }

  click(): void {
    this.clicked.emit();
  }

  getCaseStatus(id: number | null): CaseStatus | null {
    return this.settingsService.getCaseStatus(id);
  }

  getCaseType(id: number | null): CaseType | null {
    return this.settingsService.getCaseType(id);
  }

  i18n(key: string, params: any[] = [], i: number = 0): string {
    return this.i18nService.i18n(key, params, i);
  }

}
