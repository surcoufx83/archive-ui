import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[animateOpacityInAndOut]'
})
export class AnimateOpacityInAndOutDirective {

  @Input('animateOpacityInAndOut') visible!: boolean;

  constructor(private element: ElementRef) {
    if (!(<HTMLElement>this.element.nativeElement).classList.contains('animate-opacity'))
      (<HTMLElement>this.element.nativeElement).classList.add('animate-opacity');
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * Updates the 'data-visible' attribute of the element based on the visible input property.
   * 
   * @param changes - Object containing the changed properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']) {
      (<HTMLElement>this.element.nativeElement).setAttribute('data-visible', `${changes['visible'].currentValue}`);
    }
  }

}
