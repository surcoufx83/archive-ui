import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-link-btn',
  templateUrl: './link-btn.component.html',
  styleUrl: './link-btn.component.scss'
})
export class LinkBtnComponent {

  @Input() css: string[] | { [key: string]: boolean } = [];
  @Input() icon: string = '';
  @Input({ required: true }) link: string[] = [];

  icons = environment.icons;

}
