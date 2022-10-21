import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Case, CaseStatus, CaseType, Party, UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';

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
  childs: number[] = [];
  changes: { [key: string]: any } = {};
  showDeleted: boolean = false;
  showInRetention: boolean = false;
  storagename: string = this.config.storage.prefix + 'casesData';
  usersettingsObj: UserSettings | null = null;

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

  changeShowDeleted(switchvalue: boolean) : void {
    this.userSettings.showCasesInDeletion(switchvalue);
  }

  changeShowRetention(switchvalue: boolean) : void {
    this.userSettings.showCasesInRetention(switchvalue);
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  duration(duration: Duration|null) : string {
    return this.formatService.fdur(duration);
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  getCase(id: number | null): Case | null {
    return this.userSettings.getCase(id);
  }

  getChilds(id: number): number[] {
    return this.userSettings.getCaseChilds(id);
  }

  getCaseStatus(id: number | null): CaseStatus | null {
    return this.userSettings.getCaseStatus(id);
  }

  haschilds(id: number): boolean {
    return this.userSettings.hasChildCases(id);
  }

  hasParent(caseid: number, parentid: number): boolean {
    return this.userSettings.hasParentCaseWithId(caseid, parentid);
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
        this.childs = this.userSettings.getCaseChilds(this.case.id);
        this.case.period.period = this.case.period.period ?? {};
        this.case.period.minperiod = this.case.period.minperiod ?? {};
        this.case.period.terminationperiod = this.case.period.terminationperiod ?? {};
      }
    }
  }

  ngOnInit(): void {
    this.userSettings.clientSettings$.subscribe((settings) => {
      this.showDeleted = settings.casesettings.showCasesInDeletion;
      this.showInRetention = settings.casesettings.showCasesInRetention;
    });
    this.userSettings.casechilds$.subscribe((childs) => {
      if (this.case)
        this.childs = this.userSettings.getCaseChilds(this.case.id);
    });
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

  showCase(c: Case): boolean {
    let status = this.getCaseStatus(c.statusid);
    if (status == null)
      return true;
    return (!status.flags.deletion || this.showInRetention) && (!status.flags.deleted || this.showDeleted);
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
