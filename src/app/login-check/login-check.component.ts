import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-login-check',
  templateUrl: './login-check.component.html',
  styleUrls: ['./login-check.component.scss']
})
export class LoginCheckComponent implements AfterViewInit {

  constructor(private auth: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private router: Router) { }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngAfterViewInit(): void {
    this.auth.checkSession().subscribe((e) => {
      if (e.success)
        this.router.navigate(['home']);
      else
        this.router.navigate(['login']);
    });
  }

}
