import { Component } from '@angular/core';
import { ConfigService, AppConfig } from '../../config.service';

@Component({
  selector: 'ui-busy-indicator',
  templateUrl: './ui-busy-indicator.component.html',
  styleUrls: ['./ui-busy-indicator.component.scss']
})
export class UiBusyIndicatorComponent {

  colorIndex: number = 0;
  colors: string[] = [
    'text-primary',
    'text-danger',
    'text-success',
    'text-warning',
    'text-info',
    'text-dark',
  ];

  constructor(private configService: ConfigService) {
    setInterval(() => {
      this.colorIndex = Math.floor(Math.random() * this.colors.length);
    }, 3000);
  }

  get config() : AppConfig {
    return this.configService.config;
  }

}
