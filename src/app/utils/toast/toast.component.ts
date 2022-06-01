import { Component, Input, OnInit } from '@angular/core';
import { FormatService } from '../format.service';
import { Toast } from '../toasts.service';

@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  @Input('toast') toast!: Toast;
  show: boolean = false;

  constructor(private formatService: FormatService) { }

  fdist(date: Date | string | null): string {
    return this.formatService.fdist(date);
  }

  ngOnInit(): void {
    this.toast.closable = this.toast.closable ?? true;
    this.toast.disposable = this.toast.disposable ?? true;
    this.toast.disposeTime = this.toast.disposeTime ?? 10000;
    this.toast.type = this.toast.type ?? 'common';
      
    this.show = true;
    if (this.toast.disposable) {
      setTimeout(() => {
        this.show = false;
      }, this.toast.disposeTime);
    }
  }

}
