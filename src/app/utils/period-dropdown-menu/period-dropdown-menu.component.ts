import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';

@Component({
  selector: 'app-period-dropdown-menu',
  templateUrl: './period-dropdown-menu.component.html',
  styleUrls: ['./period-dropdown-menu.component.scss']
})
export class PeriodDropdownMenuComponent implements OnInit {

  @Input('period') period: Duration|null = null;
  @Output() changed = new EventEmitter();

  constructor(private configService: ConfigService,
    private i18nService: I18nService) { }

  ngOnInit(): void {
  }

  change(): void {
    this.changed.emit(this.period);
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

}
