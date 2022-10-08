import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { UserSettings } from 'src/app/if';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';
import { Case, CaseStatus } from 'src/app/if';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {

  cases: { [key: number]: Case } = {};
  casechilds: { [key: number]: number[] } = {};
  rootcases: number[] = [];
  showDeleted: boolean = false;
  showInRetention: boolean = false;
  usersettingsObj: UserSettings | null = null;

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

  case(id: number): Case {
    return this.cases[id];
  }

  changeShowDeleted(switchvalue: boolean) : void {
    this.userSettings.showCasesInDeletion(switchvalue);
  }

  changeShowRetention(switchvalue: boolean) : void {
    this.userSettings.showCasesInRetention(switchvalue);
  }

  childs(id: number): number[] {
    let childs = this.casechilds[id];
    childs.sort((a, b) => this.case(a).casepath > this.case(b).casepath ? 1 : this.case(a).casepath < this.case(b).casepath ? -1 : 0);
    return childs;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  getCaseStatus(id: number | null): CaseStatus | null {
    return this.userSettings.getCaseStatus(id);
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

  ngOnInit(): void {
    this.userSettings.clientSettings$.subscribe((settings) => {
      this.showDeleted = settings.casesettings.showCasesInDeletion;
      this.showInRetention = settings.casesettings.showCasesInRetention;
    });
    this.userSettings.cases$.subscribe((cases) => { this.cases = cases; });
    this.userSettings.casechilds$.subscribe((childs) => { this.casechilds = childs; });
    this.userSettings.caseroots$.subscribe((roots) => { this.rootcases = roots; });
  }

  showCase(c: Case): boolean {
    let status = this.getCaseStatus(c.statusid);
    if (status == null)
      return true;
    return (!status.flags.deletion || this.showInRetention) && (!status.flags.deleted || this.showDeleted);
  }

}
