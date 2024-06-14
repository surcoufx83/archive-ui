import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-sorter-icon',
  templateUrl: './sorter-icon.component.html'
})
export class SorterIconComponent {

  @Input() columnName!: string;
  @Input() sortAsc: boolean = true;
  @Input() sortBy!: string;
  @Output() click = new EventEmitter();

  icons = environment.icons;

  constructor() { }

  onClick(): void {
    this.click.emit();
  }

}
