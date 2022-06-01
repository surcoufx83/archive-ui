import { Component, OnInit } from '@angular/core';
import { Toast, ToastsService } from '../toasts.service';

@Component({
  selector: 'toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(private toastService: ToastsService) {
    toastService.toast$.subscribe((t) => {
      if (t)
        this.toasts.push(t);
    });
  }

  ngOnInit(): void {
  }

}
