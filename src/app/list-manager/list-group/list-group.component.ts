import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-list-manager-list-group',
  templateUrl: './list-group.component.html',
  styleUrl: './list-group.component.scss'
})
export class ListGroupComponent {

  @Input({ required: true }) type!: 'ul' | 'ol' | 'cb';
  @Input({ required: true }) items!: ListItem[];

  icons = environment.icons;

}
