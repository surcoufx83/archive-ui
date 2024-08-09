import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-grid-row',
  templateUrl: './grid-row.component.html',
  styleUrl: './grid-row.component.scss'
})
export class GridRowComponent implements OnChanges {

  @Input({ required: true }) items: GridRowItem[] = [];
  @Input() rowCss?: string[] | { [key: string]: boolean };

  colSize = signal<string>('col-1');
  hidden = signal<boolean>(true);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']?.currentValue) {
      this.hidden.set(changes['items'].currentValue.length === 0);
      this.colSize.set(`col-${Math.floor(12 / changes['items'].currentValue.length)}`);
    }
  }

}

export type GridRowItem = {
  colCss?: string[] | { [key: string]: boolean },
  content: string,
}