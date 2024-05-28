import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';

@Component({
  selector: 'app-notepad2-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input({ required: true }) expanded!: boolean;
  @Output() onSwitchExpanded = new EventEmitter();

  constructor(
    private i18nService: I18nService,
    ) {
      this.i18nService.setTitle('notepad2.title');
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

}
