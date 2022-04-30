import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { Settings } from '../user/settings/settings';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';
import { Case } from './case';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {

  busy: boolean = false;
  cases: { [key: number]: Case } = {};
  rootcases: number[] = [];
  casechilds: { [key: number]: number[] } = {};
  usersettingsObj: Settings|null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  case(id: number) : Case {
    return this.cases[id];
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
    this.busy = true;
    let url: string = `${this.config.api.baseUrl}/cases`;
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success) {
        let cases = <Case[]>reply.payload;
        for (let i = 0; i < cases.length; i++) {
          if (cases[i].parentid != null) {
            let p: number = <number>cases[i].parentid;
            if (!this.casechilds[p])
              this.casechilds[p] = [];
            this.casechilds[p].push(cases[i].id)
          } else
            this.rootcases.push(cases[i].id);
          this.cases[cases[i].id] = cases[i];
        }
        console.log(this.cases);
        console.log(this.casechilds);
        console.log(this.rootcases);
      }
      this.busy = false;
    });
  }

}
