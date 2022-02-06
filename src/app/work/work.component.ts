import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {

  routeUrl: string = '';

  constructor(private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router) { }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      console.log(this.router.routerState.snapshot.url)
      this.routeUrl = this.router.routerState.snapshot.url;
    });
  }

}
