import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-work-day',
  templateUrl: './work-day.component.html',
  styleUrls: ['./work-day.component.scss']
})
export class WorkDayComponent implements OnInit {

  routeUrl: string = '';
  today: moment.Moment = moment();

  constructor(private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute) { }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string, params: string[] = []) : string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.today.locale(this.i18nService.Locale);
  }

}
