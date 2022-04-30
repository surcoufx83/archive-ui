import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { CacheService } from '../svcs/cache.service';
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
  rootcases: number[] = [];
  casechilds: { [key: number]: number[] } = {};
  usersettingsObj: Settings|null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService,
    private cacheService: CacheService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.loadCases();
  }

  case(id: number) : Case {
    return this.cacheService.cases$.value[id];
  }

  childs(id: number) : number[] {
    let childs = this.casechilds[id];
    childs.sort((a, b) => this.case(a).casepath > this.case(b).casepath ? 1 : this.case(a).casepath < this.case(b).casepath ? -1 : 0);
    return childs;
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

  loadCases() : void {
    this.cacheService.cases$.subscribe((c) => {
      let cases = Object.values(c);
      let temprootcases: number[] = [];
      let tempcasechilds: { [key: number]: number[] } = {};
      for (let i = 0; i < cases.length; i++) {
        if (cases[i].parentid != null) {
          let p: number = <number>cases[i].parentid;
          if (!tempcasechilds[p])
            tempcasechilds[p] = [];
          if (!tempcasechilds[p].includes(cases[i].id))
            tempcasechilds[p].push(cases[i].id)
        } else {
          if (!temprootcases.includes(cases[i].id))
          temprootcases.push(cases[i].id);
        }
        temprootcases.sort((a, b) => this.case(a).casepath > this.case(b).casepath ? 1 : this.case(a).casepath < this.case(b).casepath ? -1 : 0);
        this.casechilds = tempcasechilds;
        this.rootcases = temprootcases;
      }
    });
  }

  ngOnInit(): void {
  }

}
