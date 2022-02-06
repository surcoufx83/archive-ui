import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
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

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.routeUrl = url[0].path;
        if (!this.isLoggedin) {
          if (!this.routeUrl.startsWith('/login') && this.routeUrl !== '/logout')
            this.router.navigateByUrl('/login');
        } else {
          if (this.routeUrl.startsWith('/login'))
            this.router.navigateByUrl('/home');
        }
    });
  }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  get isLoggedin() : boolean {
    return this.auth.isLoggedin;
  }

}
