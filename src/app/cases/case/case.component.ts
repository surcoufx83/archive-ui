import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Case, CaseStatus, CaseType, File, Party, UserSettings } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnDestroy, OnInit {

  activeRouteChild: string = '';
  busy: boolean = false;
  case: Case | null = null;
  cases: { [key: number]: Case } = {};
  casefiles: File[] = [];
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

  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private userSettings: SettingsService,
    public formatService: FormatService,
    public router: Router) {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    }));
    this.subscriptions.push(this.i18nService.loaded.subscribe((v) => {
      if (v === true) {
        this.listOfCaseStatus = this.listOfCaseStatus.sort((a, b) => this.i18n('casestatus.' + a.name) > this.i18n('casestatus.' + b.name) ? 1 : -1);
        this.listOfCaseTypes = this.listOfCaseTypes.sort((a, b) => this.i18n('casetype.' + a.name) > this.i18n('casetype.' + b.name) ? 1 : -1);
      }
    }));
    this.subscriptions.push(this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.activeRouteChild = this.route.snapshot.url.length == 3 ? this.route.snapshot.url[2].path : '';
        this.loadCase(+this.route.snapshot.url[1].path);
      }
    }));
    this.i18nService.setTitle('case.pagetitleNocase');
  }

  changeShowDeleted(switchvalue: boolean): void {
    this.userSettings.showCasesInDeletion(switchvalue);
  }

  changeShowRetention(switchvalue: boolean): void {
    this.userSettings.showCasesInRetention(switchvalue);
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  duration(duration: Duration | null): string {
    return this.formatService.fdur(duration);
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  getCase(id: number | null): Case | null {
    const tempcase = this.userSettings.getCase(id);
    return tempcase == null ? null : { ...tempcase };
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
    if (this.caseid === id)
      return;
    this.caseid = id;
    this.casefiles = [];
    if (this.caseid != null) {
      if (obj != null)
        this.case = { ...obj };
      else
        this.case = this.getCase(this.caseid);
      if (this.case) {
        this.i18nService.setTitle(`case.pagetitle_${this.activeRouteChild}`, [this.case.title]);
        this.case.parentid = this.case.parentid ?? -1;
        this.case.clientid = this.case.clientid ?? -1;
        this.case.partyid = this.case.partyid ?? -1;
        this.childs = this.userSettings.getCaseChilds(this.case.id);
        this.case.period.period = this.case.period.period ?? {};
        this.case.period.minperiod = this.case.period.minperiod ?? {};
        this.case.period.terminationperiod = this.case.period.terminationperiod ?? {};
        let url = `${this.config.api.baseUrl}/case/${this.case.id}/files`;
        this.authService.queryApi(url).subscribe((reply) => {
          if (reply.success && reply.payload && reply.payload['files']) {
            // sort files by name desc if both filenames start with date, else sort ascending
            this.casefiles = (<File[]>reply.payload['files']).sort((a, b) => (a.name.startsWith('20') && b.name.startsWith('20')) ? a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()) * -1 : a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.clientSettings$.subscribe((settings) => {
      this.showDeleted = settings.casesettings.showCasesInDeletion;
      this.showInRetention = settings.casesettings.showCasesInRetention;
    }));
    this.subscriptions.push(this.userSettings.caseChilds$.subscribe((childs) => {
      if (this.case)
        this.childs = this.userSettings.getCaseChilds(this.case.id);
    }));
    this.subscriptions.push(this.userSettings.cases$.subscribe((cases) => {
      this.cases = cases;
      this.listOfCases = Object.values(cases).sort((a, b) => a.casepath > b.casepath ? 1 : -1);
      this.loadCase(this.caseid);
    }));
    this.subscriptions.push(this.userSettings.caseStatus$.subscribe((items) => {
      this.listOfCaseStatus = Object.values(items).sort((a, b) => this.i18n('casestatus.' + a.name) > this.i18n('casestatus.' + b.name) ? 1 : -1);
    }));
    this.subscriptions.push(this.userSettings.caseTypes$.subscribe((items) => {
      this.listOfCaseTypes = Object.values(items).sort((a, b) => this.i18n('casetype.' + a.name) > this.i18n('casetype.' + b.name) ? 1 : -1);
    }));
    this.subscriptions.push(this.userSettings.clients$.subscribe((items) => {
      this.listOfClients = Object.values(items).sort((a, b) => a.name1.toLocaleLowerCase() > b.name1.toLocaleLowerCase() ? 1 : -1);
    }));
    this.subscriptions.push(this.userSettings.parties$.subscribe((items) => {
      this.listOfParties = Object.values(items).sort((a, b) => a.name1.toLocaleLowerCase() > b.name1.toLocaleLowerCase() ? 1 : -1);
    }));
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
