import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { CacheService } from 'src/app/svcs/cache.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';
import { Case } from '../case';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  busy: boolean = false;
  case: Case|null = null;
  caseid: number|null = null;
  usersettingsObj: Settings|null = null;
  
  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private userSettings: SettingsService,
    public formatService: FormatService,
    private cacheService: CacheService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date|string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        let casetemp = params.get('id');
        if (casetemp) {
          this.caseid = +casetemp;
          if (this.cacheService.cases$.value[this.caseid])
            this.case = this.cacheService.cases$.value[this.caseid];
        }
      }
    });
    this.cacheService.cases$.subscribe((cases) => {
      if (this.caseid) {
        this.case = cases[this.caseid];
      }
    });
  }

}
