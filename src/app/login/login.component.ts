import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ApiReply } from '../api-reply';
import { ConfigService } from '../config.service';
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
              private http: HttpClient) { }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngOnInit() : void {
  }

  submit() : void {
    if (this.busy)
      return;
    console.log(this.user, this.password);
    this.busy = true;
    this.auth.login(this.user, this.password).subscribe((s) => {
      if (s.success == false) {
        this.busy = false;
        this.failed = 'login.failed';
      }
    });
  }

}
