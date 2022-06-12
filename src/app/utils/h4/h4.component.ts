import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-h4',
  templateUrl: './h4.component.html',
  styleUrls: ['./h4.component.scss']
})
export class H4Component {

  @Input('containercss') containercss: string = '';
  @Input('title') title: string = '';
  @Input('busy') busy?: boolean;
  @Input('btn1') btn1: string = '';
  @Input('btn1css') btn1css: string = '';
  @Input('btn1icon') btn1Icon: string = '';
  @Input('btn1link') btn1Link: string = '';
  @Input('btn2') btn2: string = '';
  @Input('btn2css') btn2css: string = '';
  @Input('btn2icon') btn2Icon: string = '';
  @Input('btn2link') btn2Link: string = '';
  @Input('xshow') xShow: boolean = false;
  @Output() btn1Clicked = new EventEmitter();
  @Output() btn2Clicked = new EventEmitter();
  @Output() xClicked = new EventEmitter();

  btn1click() : void {
    this.btn1Clicked.emit();
  }

  btn2click() : void {
    this.btn2Clicked.emit();
  }

  xclick() : void {
    this.xClicked.emit();
  }

}
