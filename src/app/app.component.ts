import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService, AppConfig } from './config.service';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  routeUrl: string = '';

  constructor(private auth: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router) { }

  get config() : AppConfig {
    return this.configService.config;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  get isLoggedin() : boolean {
    return this.auth.isLoggedin;
  }

  ngOnInit() { }

}
