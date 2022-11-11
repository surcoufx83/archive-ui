import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConfig, ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-sorter-icon',
  templateUrl: './sorter-icon.component.html'
})
export class SorterIconComponent {

  @Input() columnName!: string;
  @Input() sortAsc: boolean = true;
  @Input() sortBy!: string;
  @Output() click = new EventEmitter();

  constructor(private configService: ConfigService) { }

  get config(): AppConfig {
    return this.configService.config;
  }

  onClick(): void {
    this.click.emit();
  }

}
