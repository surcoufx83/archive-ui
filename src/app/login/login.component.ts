import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ConfigService, AppConfig } from '../config.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  busy: boolean = false;
  password: string = '';
  user: string = '';
  failed: string = '';

  constructor(private auth: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private router: Router,
              private route: ActivatedRoute)
  { }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngOnInit() : void {
    if (this.auth.hasSession)
      this.router.navigate(['logincheck']);
  }

  submit() : void {
    if (this.busy)
      return;
    this.busy = true;
    this.auth.login(this.user, this.password).subscribe((s) => {
      if (s.success == false) {
        this.busy = false;
        this.failed = 'login.failed';
      }
    });
  }

  submitOauth2() : void {
    if (this.busy)
      return;
    this.busy = true;
    let url = this.config.auth.oauth2.endpoint + '?response_type=code'
              + '&client_id=' + this.config.auth.oauth2.clientId
              + '&client_secret=' + this.config.auth.oauth2.clientSecret
              + '&state=' + this.config.auth.oauth2.state
              + '&redirect_uri=' + this.config.auth.oauth2.redirectUrl;
    location.replace(url);
  }

}
