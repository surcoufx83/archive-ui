import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from 'src/app/auth.service';
import { Party } from 'src/app/common';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';
import { Case, CaseStatus, CaseType } from '../case';

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

  listOfCases: Case[] = [];
  listOfCaseStatus: CaseStatus[] = [];
  listOfCaseTypes: CaseType[] = [];
  listOfClients: Party[] = [];
  listOfParties: Party[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.i18nService.loaded.subscribe((v) => {
      if (v === true) {
        this.listOfCaseStatus = this.listOfCaseStatus.sort((a, b) => this.i18n('casestatus.' + a.name) > this.i18n('casestatus.' + b.name) ? 1 : -1);
        this.listOfCaseTypes = this.listOfCaseTypes.sort((a, b) => this.i18n('casetype.' + a.name) > this.i18n('casetype.' + b.name) ? 1 : -1);
      }
    })
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  getCase(id: number | null): Case | null {
    if (id == null)
      return null;
    if (this.cases[id])
      return this.cases[id];
    return null;
  }

  getCaseStatus(id: number | null): CaseStatus | null {
    return this.userSettings.getCaseStatus(id);
  }

  hasParent(caseid: number, parentid: number): boolean {
    if (caseid == parentid)
      return true;
    let case1 = this.getCase(caseid);
    if (case1 == null)
      return false;
    if (case1.parentid == parentid)
      return true;
    if (case1.parentid != null) {
      return this.hasParent(case1.parentid, parentid);
    }
    return false;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  private loadCase(id: number | null, obj: Case | null = null): void {
    this.caseid = id;
    if (this.caseid != null) {
      if (obj != null)
        this.case = obj;
      else if (this.cases[this.caseid])
        this.case = { ...this.cases[this.caseid] };
      if (this.case) {
        this.case.parentid = this.case.parentid ?? -1;
        this.case.clientid = this.case.clientid ?? -1;
        this.case.partyid = this.case.partyid ?? -1;
      }
      console.log(this.case)
    }
  }

  ngOnInit(): void {
    this.userSettings.cases$.subscribe((cases) => {
      this.cases = cases;
      this.listOfCases = Object.values(cases).sort((a, b) => a.casepath > b.casepath ? 1 : -1);
      this.loadCase(this.caseid);
    });
    this.userSettings.caseStatus$.subscribe((items) => {
      this.listOfCaseStatus = Object.values(items).sort((a, b) => this.i18n('casestatus.' + a.name) > this.i18n('casestatus.' + b.name) ? 1 : -1);
    });
    this.userSettings.caseTypes$.subscribe((items) => {
      this.listOfCaseTypes = Object.values(items).sort((a, b) => this.i18n('casetype.' + a.name) > this.i18n('casetype.' + b.name) ? 1 : -1);
    });
    this.userSettings.clients$.subscribe((items) => {
      this.listOfClients = Object.values(items).sort((a, b) => a.name1.toLocaleLowerCase() > b.name1.toLocaleLowerCase() ? 1 : -1);
    });
    this.userSettings.parties$.subscribe((items) => {
      this.listOfParties = Object.values(items).sort((a, b) => a.name1.toLocaleLowerCase() > b.name1.toLocaleLowerCase() ? 1 : -1);
    });
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        let casetemp = params.get('id');
        if (casetemp)
          this.loadCase(+casetemp);
      }
    });
  }

  updateCase(): void {
    if (!this.case)
      return;
    this.userSettings.updateCase(this.case).subscribe((reply) => {
      if (reply != null && typeof reply === 'object') {
        this.loadCase(this.caseid);
      }
    });
  }

}
