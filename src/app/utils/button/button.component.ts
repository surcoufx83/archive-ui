import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  
  @Input('css') css: string = '';
  @Input('icon') icon: string = '';
  @Input('link') link: string = '';
  @Input('title') title: string = '';
  @Output() clicked = new EventEmitter();

  click() : void {
    this.clicked.emit();
  }

}
