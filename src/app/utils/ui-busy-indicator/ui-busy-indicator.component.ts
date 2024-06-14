import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'ui-busy-indicator',
  templateUrl: './ui-busy-indicator.component.html',
  styleUrls: ['./ui-busy-indicator.component.scss']
})
export class UiBusyIndicatorComponent implements OnDestroy, OnInit {

  colorIndex: number = 0;
  colors: string[] = [
    'text-primary',
    'text-danger',
    'text-success',
    'text-warning',
    'text-info',
    'text-dark',
  ];
  icons = environment.icons;
  private intervalSubscription?: any;

  constructor() { }

  ngOnDestroy(): void {
    clearInterval(this.intervalSubscription);
  }

  ngOnInit(): void {
    this.intervalSubscription = setInterval(() => {
      this.colorIndex = Math.floor(Math.random() * this.colors.length);
    }, 3000);
  }

}
