import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.scss']
})
export class ConfirmDeletionComponent {

  @Input() backdrop: boolean = true;
  @Input() cancelable: boolean = true;
  @Input() modalId: string = 'confirm-deletion-modal';
  @Input() question: string = '';
  @Input() scrollable: boolean = false;
  @Input() title: string = '';
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
  @ViewChild('.modal') modal?: ElementRef;

  icons = environment.icons;

  constructor(
    private i18nService: I18nService) {
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

}
