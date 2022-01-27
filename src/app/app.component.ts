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
    console.log(this.route);
    this.route.url.subscribe(url => {
      console.log(url);
      this.routeUrl = url[0].path;
        console.log(this.routeUrl);
        if (!this.isLoggedin()) {
          if (this.routeUrl !== '/login' && this.routeUrl !== '/logout')
            this.router.navigateByUrl('/login');
        } else {
          if (this.routeUrl === '/login')
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

  isLoggedin() : boolean {
    return this.auth.isLoggedin();
  }

}
