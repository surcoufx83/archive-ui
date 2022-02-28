import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../auth.service';
import { Case } from '../cases/case';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { Directory, File } from '../files/file';
import { Note } from '../notepad/note';
import { Settings } from '../user/settings/settings';
import { SettingsService } from '../user/settings/settings.service';
import { SearchResults } from './searchresult';
import { BankAccount, StandingOrder } from '../account/account';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  busy: boolean = false;
  resultcount: number = 0;
  resultgroupcount: {[key: string]: number} = {};
  resultgroups: string[] = ['noteitem', 'casesitem', 'bankaccount', 'bankstandingorder', 'filesitem', 'directoriesitem'];
  searchphrase: string = '';
  searchtoken: string = '';
  searchresults: SearchResults = {};
  showgroup: string = 'noteitem';
  showHistoric: boolean = false;
  usersettingsObj?: Settings;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService)
  {
    this.settings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get bankaccounts(): BankAccount[] {
    if (!this.searchresults.bankaccount)
      return [];
    return Object.values(this.searchresults.bankaccount).slice(0, this.usersettingsObj?.view.lists.length ?? 25);
  }

  get cases(): Case[] {
    if (!this.searchresults.casesitem)
      return [];
    return Object.values(this.searchresults.casesitem).slice(0, this.usersettingsObj?.view.lists.length ?? 25);
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  get directories(): Directory[] {
    if (!this.searchresults.directoriesitem)
      return [];
    return Object.values(this.searchresults.directoriesitem).slice(0, this.usersettingsObj?.view.lists.length ?? 25);
  }

  f(date: Date|string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  get files(): File[] {
    if (!this.searchresults.filesitem)
      return [];
    return Object.values(this.searchresults.filesitem).slice(0, this.usersettingsObj?.view.lists.length ?? 25);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.reset();
      this.showgroup = params.get('tab') ?? 'noteitem';
      this.searchtoken = params.get('token') ?? '';
      this.search((params.get('phrase') ?? ''), (params.get('token') ?? ''));
    });
  }

  get notes(): Note[] {
    if (!this.searchresults.noteitem)
      return [];
    return Object.values(this.searchresults.noteitem).slice(0, this.usersettingsObj?.view.lists.length ?? 25);
  }

  reset() : void {
    this.resultcount = 0;
    this.resultgroupcount = {};
    this.searchresults = {};
  }

  search(phrase: string, token: string) : void {
    if (phrase === '')
      return;
    if (this.busy)
      return;
    this.busy = true;
    this.searchphrase = phrase;

    let storeitem = this.configService.getSearchResult(this.config.storage.prefix + phrase + token);
    if (storeitem != null) {
      this.searchresults = storeitem;
      this.onSearchCompleted();
      return;
    }

    let url = this.config.api.baseUrl + '/search';
    this.authService.updateApi(url, { search: phrase }).subscribe((reply) => {
      this.reset();
      if (reply.success && reply.payload != null) {
        this.searchresults = <SearchResults>reply.payload['resultitems'];
        this.configService.setSearchResult(this.config.storage.prefix + phrase + token, this.searchresults);
        this.onSearchCompleted();
      } else {
        
      }
      this.busy = false;
    });

  }

  onSearchCompleted() : void {
    for (let [key, obj] of Object.entries(this.searchresults)) {
      this.resultgroupcount[key] = Object.keys(obj).length;
      this.resultcount += this.resultgroupcount[key];
    }
    if (this.resultgroupcount[this.showgroup] == undefined || this.resultgroupcount[this.showgroup] === 0) {
      for (let i = 0; i < this.resultgroups.length; i++) {
        if (this.resultgroupcount[this.resultgroups[i]] > 0) {
          this.showgroup = this.resultgroups[i];
          this.router.navigate(['/search', this.searchphrase, this.searchtoken, this.resultgroups[i]]);
        }
      }
    }
    this.busy = false;
  }

  get standingorders(): StandingOrder[] {
    if (!this.searchresults.bankstandingorder)
      return [];
    return Object.values(this.searchresults.bankstandingorder).slice(0, this.usersettingsObj?.view.lists.length ?? 25);
  }

}
