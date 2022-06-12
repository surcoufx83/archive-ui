import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/account/account';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export interface DbCurrenciesStorage {
  items: Currency[]
}
