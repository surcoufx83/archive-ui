import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges {

  @Input() icon = '';
  @Input({ required: true }) title = '';
  @Input() progressBar?: CardProgress;

  icons = environment.icons;
  progressItems = signal<CardProgressItemInternal[]>([]);
  progressMax = signal<number>(100);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progressBar']?.currentValue) {
      let newitems: CardProgressItemInternal[] = [];
      for (const item of changes['progressBar']?.currentValue.items) {
        newitems.push({
          css: item.css,
          ariaValue: item.value,
          widthPercent: `${item.value / changes['progressBar']?.currentValue.max * 100}%`
        })
      }
      this.progressItems.set(newitems);
      this.progressMax.set(changes['progressBar']?.currentValue.max);
    }
    else {
      this.progressItems.set([]);
    }
  }

}

export type CardProgress = {
  max: number,
  items: CardProgressItem[],
}

export type CardProgressItem = {
  css?: string[] | { [key: string]: boolean },
  value: number,
}

type CardProgressItemInternal = {
  css?: string[] | { [key: string]: boolean },
  widthPercent: string,
  ariaValue: number,
}
