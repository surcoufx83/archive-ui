import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[contentEditableWithBinding]',
  host: {
    '(keyup)': 'onKeyup()'
  }
})
export class ContentEditableWithBindingDirective {

  @Input('contentEditableWithBinding') modelInput!: string;
  @Output('contentEditableWithBindingChange') modelChange = new EventEmitter<string>();

  private lastViewModel?: string;

  constructor(private element: ElementRef) {
    this.element.nativeElement.contentEditable = true;
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * Updates the lastViewModel and refreshes the view if the modelInput has changed.
   * 
   * @param changes - Object containing the changed properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelInput'] && changes['modelInput'].currentValue !== this.lastViewModel) {
      this.lastViewModel = this.modelInput;
      this.element.nativeElement.innerText = this.modelInput;
    }
  }

  /**
     * Event handler for the keyup event. 
     * Updates the lastViewModel with the current content and emits the updated value.
     */
  onKeyup() {
    var value = this.element.nativeElement.innerText;
    this.lastViewModel = value;
    this.modelChange.emit(value);
  }

}
