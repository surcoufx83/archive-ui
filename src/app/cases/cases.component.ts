import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { Case, CaseStatus, UserSettings } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { I18nService } from '../i18n.service';
import { FormatService } from '../utils/format.service';
import { SettingsService } from '../utils/settings.service';
import { L10nArchiveLocale } from '../l10n/l10n.types';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnDestroy, OnInit {

  casechilds: { [key: number]: number[] } = {};
  cases: { [key: number]: Case } = {};
  icons = environment.icons;
  rootcases: number[] = [];
  showDeleted: boolean = false;
  showInRetention: boolean = false;
  subscriptions: Subscription[] = [];
  usersettingsObj: UserSettings | null = null;

  constructor(
    private i18nService: I18nService,
    private userSettings: SettingsService,
    public formatService: FormatService,
    public router: Router,
  ) {
    this.userSettings.loadArchiveSettings();
    this.i18nService.setTitle('cases.pagetitle');
  }

  case(id: number): Case {
    return this.cases[id];
  }

  changeShowDeleted(switchvalue: boolean): void {
    this.userSettings.showCasesInDeletion(switchvalue);
  }

  changeShowRetention(switchvalue: boolean): void {
    this.userSettings.showCasesInRetention(switchvalue);
  }

  childs(id: number): number[] {
    let childs = this.casechilds[id];
    childs.sort((a, b) => this.case(a).casepath > this.case(b).casepath ? 1 : this.case(a).casepath < this.case(b).casepath ? -1 : 0);
    return childs;
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

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.clientSettings$.subscribe((settings) => {
      this.showDeleted = settings.casesettings.showCasesInDeletion;
      this.showInRetention = settings.casesettings.showCasesInRetention;
    }));
    this.subscriptions.push(this.userSettings.cases$.subscribe((cases) => { this.cases = cases; }));
    this.subscriptions.push(this.userSettings.caseChilds$.subscribe((childs) => { this.casechilds = childs; }));
    this.subscriptions.push(this.userSettings.caseRoots$.subscribe((roots) => { this.rootcases = roots; }));
  }

  showCase(c: Case): boolean {
    let status = this.getCaseStatus(c.statusid);
    if (status == null)
      return true;
    return (!status.flags.deletion || this.showInRetention) && (!status.flags.deleted || this.showDeleted);
  }

}
