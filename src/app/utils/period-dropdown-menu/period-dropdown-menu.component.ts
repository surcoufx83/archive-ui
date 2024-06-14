import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/i18n.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-period-dropdown-menu',
  templateUrl: './period-dropdown-menu.component.html',
  styleUrls: ['./period-dropdown-menu.component.scss']
})
export class PeriodDropdownMenuComponent {

  @Input({ required: true }) period: Duration | null = null;
  @Input({ required: true }) idprefix!: string;
  @Output() changed = new EventEmitter();

  icons = environment.icons;

  constructor(
    private i18nService: I18nService
  ) { }

  change(): void {
    this.changed.emit(this.period);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

}
