import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-oauth2-callback',
  templateUrl: './oauth2-callback.component.html',
  styleUrls: ['./oauth2-callback.component.scss']
})
export class Oauth2CallbackComponent implements OnDestroy, OnInit {

  private sub?: Subscription

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((parms: ParamMap) => {
      let hostconfig = environment.api.auth.oauth2Providers[location.hostname];
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
