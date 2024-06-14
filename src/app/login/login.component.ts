import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  busy: boolean = false;
  failed: string = '';
  icons = environment.icons;
  password: string = '';
  user: string = '';

  constructor(
    private auth: AuthService,
    private i18nService: I18nService,
    private router: Router,
  ) { }

  i18n(key: string): string {
    return this.i18nService.i18n(key);
  }

  ngOnInit(): void {
    if (this.auth.hasSession)
      this.router.navigate(['logincheck']);
  }

  submit(): void {
    if (this.busy)
      return;
    this.busy = true;
    this.auth.login(this.user, this.password).pipe(first()).subscribe((s) => {
      if (s.success == false) {
        this.busy = false;
        this.failed = 'login.failed';
      }
    });
  }

  submitOauth2(): void {
    if (this.busy)
      return;
    this.busy = true;
    let hostconfig = environment.api.auth.oauth2Providers[location.hostname];
    if (!hostconfig)
      return;
    let url = `${hostconfig.baseUrl}/apps/oauth2/authorize?response_type=code&client_id=${hostconfig.clientId}&client_secret=${hostconfig.clientSecret}&state=${hostconfig.state}&redirect_uri=${encodeURIComponent(`${location.href}/oauth2`)}`;
    location.replace(url);
  }

}
