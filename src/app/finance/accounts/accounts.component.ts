import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService) {
    this.i18nService.setTitle('accounts.pagetitle');
  }

  ngOnInit(): void {
  }

}
