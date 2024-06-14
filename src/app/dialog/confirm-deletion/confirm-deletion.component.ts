import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
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

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

}
