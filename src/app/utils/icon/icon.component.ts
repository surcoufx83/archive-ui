import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html'
})
export class IconComponent {

  @Input() iconClass!: string;
  @Input() addCssClasses: string = '';
  @Input() beat: boolean = false;
  @Input() bounce: boolean = false;
  @Input() fade: boolean = false;
  @Input() fixedWidth: boolean = false;
  @Input() flip: boolean = false;
  @Input() marginEnd: number = 0;
  @Input() pulse: boolean = false;
  @Input() reverse: boolean = false;
  @Input() shake: boolean = false;
  @Input() spin: boolean = false;

  constructor() { }

  get classes(): any {
    let out: any = {
      'fa-fw': this.fixedWidth,
      'fa-beat': this.beat && !this.fade,
      'fa-fade': this.fade && !this.beat,
      'fa-beat-fade': this.beat && this.fade,
      'fa-bounce': this.bounce,
      'fa-flip': this.flip,
      'fa-shake': this.shake,
      'fa-spin': this.spin && !this.pulse,
      'fa-spin-reverse': this.reverse,
      'fa-spin-pulse': this.pulse && !this.spin
    };
    out[this.iconClass] = true;
    out[this.me] = this.marginEnd > 0 && this.marginEnd < 6;
    if (this.addCssClasses != '')
      out[this.addCssClasses] = true;
    return out;
  }

  get me(): string {
    return 'me-' + this.marginEnd;
  }

}
