import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() icon = '';
  @Input({ required: true }) title = '';

  icons = environment.icons;

}
