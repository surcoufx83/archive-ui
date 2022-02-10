import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { UiCenteredBusyIndicatorComponent } from '../../utils/ui-centered-busy-indicator/ui-centered-busy-indicator.component';
import { AuthService } from '../../auth.service';
import { ConfigService, AppConfig } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { WorkMonth } from '../work-month';
import { SettingsService } from '../../user/settings/settings.service';
import { Settings } from '../../user/settings/settings';
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
  usersettingsObj?: Settings;
  worksettingsObj?: WorkSettings;
  monthLoading: boolean = false;
  monthObj?: WorkMonth;
  dayObjs?: any[];

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router,
              private userSettings: SettingsService,
              private workSettings: WorkSettingsService)
  {
    console.log('WorkMonthComponent');
    this.userSettings.settings$.subscribe((settings) => {
      console.log('WorkMonthComponent', settings);
      this.usersettingsObj = settings;
    })
    this.workSettings.workSettings$.subscribe((settings) => {
      console.log('WorkMonthComponent', settings);
      this.worksettingsObj = settings;
    })
  }

  get config(): AppConfig {
    return this.configService.config;
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
        this.monthLoading = true;
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
    let url = this.config.api.baseUrl + '/work/month/' + this.selectedMonth.format('YYYY-M');
    this.authService.queryApi(url).subscribe((reply) => {
      console.log(reply);
      if (reply.success && reply.payload != undefined) {
        if (reply.payload['month'] != null) {
          this.monthObj = <WorkMonth>reply.payload['month'];
          this.monthObj.datefrom = moment(this.monthObj.datefrom).locale(this.i18nService.Locale);
          this.monthObj.dateuntil = moment(this.monthObj.dateuntil).locale(this.i18nService.Locale);
          this.monthObj.updated = moment(this.monthObj.updated).locale(this.i18nService.Locale);
          if (reply.payload['days'] != null) {
            this.dayObjs = reply.payload['days'];
          }
        }
      }
      console.log(this.monthObj);
      this.monthLoading = false;
    });
  }

  pushUserSettings() : void {
    this.userSettings.update(<Settings>this.usersettingsObj, true);
  }

}
