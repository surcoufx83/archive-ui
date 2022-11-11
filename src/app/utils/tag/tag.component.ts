import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { Tag } from 'src/app/if';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

  @Input() tag!: Tag;
  @Output() xclick = new EventEmitter();

  constructor(private configService: ConfigService) { }

  get config(): AppConfig {
    return this.configService.config;
  }

  onXClick(): void {
    this.xclick.emit();
  }

}
