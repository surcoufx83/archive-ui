import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
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
    let hostconfig = this.config.auth.oauth2.items[window.location.host];
    if (!hostconfig)
      return;
    let url = hostconfig.endpoint + '?response_type=code'
              + '&client_id=' + hostconfig.clientId
              + '&client_secret=' + hostconfig.clientSecret
              + '&state=' + hostconfig.state
              + '&redirect_uri=' + hostconfig.redirectUrl;
    location.replace(url);
  }

}
