import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

  @Input() tag!: Tag;
  @Output() xclick = new EventEmitter();

  icons = environment.icons;

  constructor() { }

  onXClick(): void {
    this.xclick.emit();
  }

}
