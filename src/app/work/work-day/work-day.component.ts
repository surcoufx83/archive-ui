import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-work-day',
  templateUrl: './work-day.component.html',
  styleUrls: ['./work-day.component.scss']
})
export class WorkDayComponent implements OnInit {

  routeUrl: string = '';

  constructor(private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute) { }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      console.log(url, url[0].path)
      this.routeUrl = url[0].path;
    });
  }

}
