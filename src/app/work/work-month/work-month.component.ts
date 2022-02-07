import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { WorkSettingsService } from '../settings/work-settings.service';
import { WorkSettings } from '../settings/work-settings';

@Component({
  selector: 'app-work-month',
  templateUrl: './work-month.component.html',
  styleUrls: ['./work-month.component.scss']
})
export class WorkMonthComponent implements OnInit {

  today: moment.Moment = moment();
  selectedMonth: moment.Moment = moment();
  firstOfMonth: moment.Moment = moment().startOf('month');
  year: number|undefined;
  month: number|undefined;
  worksettingsObj?: WorkSettings;

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router,
              private workSettings: WorkSettingsService)
  {
    console.log('WorkMonthComponent');
    this.workSettings.workSettings$.subscribe((settings) => {
      console.log('WorkMonthComponent', settings);
      this.worksettingsObj = settings;
    })
  }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string, params: string[] = []) : string {
    return this.i18nService.i18n(key, params);
  }

  get IsToday() : boolean {
    return this.today.isSame(this.selectedMonth, 'month');
  }

  get LastMonth() : moment.Moment {
    return moment(this.selectedMonth).subtract(1, 'months');
  }

  get NextMonth() : moment.Moment {
    return moment(this.selectedMonth).add(1, 'months');
  }

  ngOnInit(): void {
    this.selectedMonth.locale(this.i18nService.Locale);
    this.firstOfMonth.locale(this.i18nService.Locale);
    this.route.paramMap.subscribe((params: ParamMap) => {
      let y = params.get('year');
      if (y != null && +y >= 2022 && +y <= (+this.selectedMonth.format('YYYY') + 2))
        this.year = +y;
      else
        this.year = undefined;
      let m = params.get('month');
      if (m != null && +m >= 1 && +m <= 12)
        this.month = +m;
      else
        this.month = undefined;
      if (this.year == undefined && this.month == undefined)
        this.router.navigate(['work', 'month', this.selectedMonth.format('YYYY'), this.selectedMonth.format('M')]);
      else if (this.year == undefined && this.month != undefined)
        this.router.navigate(['work', 'month', this.selectedMonth.format('YYYY'), this.month]);
      else if (this.year != undefined && this.month == undefined)
        this.router.navigate(['work', 'month', this.year, this.selectedMonth.format('M')]);
      else {
        this.selectedMonth = moment([<number>this.year, <number>this.month - 1, +this.selectedMonth.format('D')]);
        this.firstOfMonth = moment([<number>this.year, <number>this.month - 1, 1]);
        this.selectedMonth.locale(this.i18nService.Locale);
        this.firstOfMonth.locale(this.i18nService.Locale);
        this.ngOnInitLoadFromBackend();
      }
    });
  }

  ngOnInitLoadFromBackend() : void {
    console.log('ngOnInitLoadFromBackend', this.selectedMonth.format('YYYY-MM-DD'));
    let url = this.configService.ApiBaseUrl + '/work/month/' + this.selectedMonth.format('YYYY-M');
    this.authService.queryApi(url).subscribe((reply) => {
      console.log(reply);
    });
  }

}
