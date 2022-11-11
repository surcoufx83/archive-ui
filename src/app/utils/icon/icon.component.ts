import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html'
})
export class IconComponent {

  @Input() iconClass!: string;
  @Input() addCssClasses: string|string[] = '';
  @Input() beat: boolean = false;
  @Input() bounce: boolean = false;
  @Input() fade: boolean = false;
  @Input() fixedWidth: boolean = false;
  @Input() flip: boolean = false;
  @Input() fontSize: number = 0;
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
    out['me-' + this.marginEnd] = this.marginEnd > 0 && this.marginEnd < 6;
    out['fs-' + this.fontSize] = this.fontSize > 0 && this.fontSize < 9;
    if (!(this.addCssClasses === '')) {
      if (Array.isArray(this.addCssClasses))
        this.addCssClasses.forEach((c) => out[c] = true);
      else
        out[this.addCssClasses] = true;
    }
    return out;
  }

}
