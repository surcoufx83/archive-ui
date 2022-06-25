import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ConfigService, AppConfig } from '../../config.service';

@Component({
  selector: 'app-oauth2-callback',
  templateUrl: './oauth2-callback.component.html',
  styleUrls: ['./oauth2-callback.component.scss']
})
export class Oauth2CallbackComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private configService: ConfigService)
  { }

  get config() : AppConfig {
    return this.configService.config;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((parms: ParamMap) => {
      let hostconfig = this.config.auth.oauth2.items[window.location.host];
      if (!hostconfig) {
        this.router.navigate(['login']);
        return;
      }
      if (parms.has('state') && parms.has('code') && <string>parms.get('state') === hostconfig.state) {
        this.authService.processOauth2Redirect(<string>parms.get('state'), <string>parms.get('code'));
      } else {
        this.router.navigate(['login']);
      }
    });
  }

}
