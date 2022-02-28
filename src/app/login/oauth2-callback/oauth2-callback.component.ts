import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ApiReply } from '../../api-reply';
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
    console.log('Oauth2CallbackComponent', this.route.queryParamMap);
    this.route.queryParamMap.subscribe((parms: ParamMap) => {
      console.log(parms);
      if (parms.has('state') && parms.has('code') && <string>parms.get('state') === this.config.auth.oauth2.state) {
        this.authService.processOauth2Redirect(<string>parms.get('state'), <string>parms.get('code')).subscribe((reply: ApiReply) => {
          console.log(reply);
        });
      } else {
        this.router.navigate(['login']);
      }
    });
  }

}
