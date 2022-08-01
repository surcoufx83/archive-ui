import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';
import { Case } from '../case';
import { CasesStorage } from '../cases.component';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  busy: boolean = false;
  case: Case | null = null;
  cases: { [key: number]: Case } = {};
  caseid: number | null = null;
  changes: { [key: string]: any } = {};
  storagename: string = this.config.storage.prefix + 'casesData';
  usersettingsObj: Settings | null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let olddata: string | null | CasesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <CasesStorage>JSON.parse(olddata);
      this.cases = olddata.cases;
    }
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  getCase(id: number|null): Case|null {
    if (id == null)
      return null;
    if (this.cases[id])
      return this.cases[id];
    return null;
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
          if (this.cases[this.caseid])
            this.case = this.cases[this.caseid];
        }
      }
    });
  }

  updateCase(): void {

  }

}
