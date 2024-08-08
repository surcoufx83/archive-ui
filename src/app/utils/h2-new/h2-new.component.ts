import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-h2-new',
  templateUrl: './h2-new.component.html',
  styleUrl: './h2-new.component.scss'
})
export class H2NewComponent {

  @Input() busy?: boolean = false;

}
