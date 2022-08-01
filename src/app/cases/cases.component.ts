import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class CasesComponent implements OnInit, OnDestroy {

  busy: boolean = false;
  cases: { [key: number]: Case } = {};
  casechilds: { [key: number]: number[] } = {};
  rootcases: number[] = [];
  storagename: string = this.config.storage.prefix + 'casesData';
  updatetimeout: any;
  usersettingsObj: Settings | null = null;
  when: number = 0;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let olddata: string | null | CasesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <CasesStorage>JSON.parse(olddata);
      this.cases = olddata.cases;
      this.rootcases = olddata.rootcases;
      this.casechilds = olddata.casechilds;
      this.when = olddata.ts;
    }
  }

  case(id: number): Case {
    return this.cases[id];
  }

  childs(id: number): number[] {
    let childs = this.casechilds[id];
    childs.sort((a, b) => this.case(a).casepath > this.case(b).casepath ? 1 : this.case(a).casepath < this.case(b).casepath ? -1 : 0);
    return childs;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  haschilds(id: number): boolean {
    return this.casechilds[id] != undefined && this.casechilds[id].length > 0;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    if (this.updatetimeout)
      clearTimeout(this.updatetimeout);
  }

  ngOnInit(): void {
    this.update();
  }

  saveLocalStorage(): void {
    localStorage.setItem(this.storagename, JSON.stringify({
      casechilds: this.casechilds,
      cases: this.cases,
      rootcases: this.rootcases,
      ts: this.when,
    }));
  }

  update(): void {
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/cases' + (this.when > 0 ? '/' + this.when : '');
    let clean = this.when == 0;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <CasesResponse>reply.payload;
        let needsrefresh = false;
        response.cases.forEach((c) => { if (this.update_addCase(c)) needsrefresh = true; });
        if (needsrefresh)
          this.update_evaluateCases();
        this.saveLocalStorage();
      }
      this.busy = false;
      this.updatetimeout = setTimeout(() => { this.update(); }, 1500);
    });
  }

  update_addCase(c: Case): boolean {
    let needsrefresh = false;
    if (this.cases[c.id] != undefined) {
      if (this.cases[c.id].parentid !== c.parentid)
        needsrefresh = true;
    }
    else
      needsrefresh = true;
    if (c.deleted == null)
      this.cases[c.id] = c;
    else {
      delete this.cases[c.id];
      needsrefresh = true;
    }
    return needsrefresh;
  }

  update_evaluateCases(): void {
    this.rootcases = [];
    this.casechilds = {};
    for (let key in this.cases) {
      console.log(key);
      let c = this.cases[key];
      if (c.parentid == null) {
        this.rootcases.push(c.id);
        this.casechilds[c.id] = [];
      } else {
        if (this.casechilds[c.parentid] == undefined)
          this.casechilds[c.parentid] = [];
        this.casechilds[c.parentid].push(c.id);
      }
    }
    this.rootcases.sort((a, b) => this.case(a).title > this.case(b).title ? 1 : -1);
  }

}

export interface CasesResponse {
  cases: Case[];
}

export interface CasesStorage {
  rootcases: number[];
  casechilds: { [key: number]: number[] };
  cases: { [key: number]: Case };
  ts: number;
}
