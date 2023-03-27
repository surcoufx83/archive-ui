import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { UserSettings } from 'src/app/if';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../user/settings/settings.service';
import { SearchResultAccountItem, SearchResultCaseItem, SearchResultDirectoryItem, SearchResultFileItem, SearchResultNoteItem, SearchResultPageItem, SearchResults } from './searchresult';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  busy: boolean = false;
  debounce: any = null;
  resultcount: number = 0;
  resultgroupcount: { [key: string]: number } = {};
  resultgroups: string[] = ['notes', 'cases', 'files', 'pages', 'directories', 'accounts'];
  phrase: string = '';
  searchactive: string[] = [];
  searchphrase: string = '';
  searchresults: SearchResults = {};
  searchgroups: { [key: string]: any }[] = [
    { groupName: 'notepad', searchPath: '/notepad/search', active: true },
    { groupName: 'cases', searchPath: '/cases/search', active: true },
    { groupName: 'files', searchPath: '/files/search', active: true },
    { groupName: 'pages', searchPath: '/files/searchContent', active: false },
    { groupName: 'directories', searchPath: '/directories/search', active: true },
    { groupName: 'accounts', searchPath: '/accounts/search', active: true }
  ];
  searchtoken: string = '';
  showgroup: string = 'notes';
  showHistoric: boolean = false;
  urltoken: string = '';
  usersettingsObj: UserSettings | null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    public router: Router,
    private settings: SettingsService) {
    this.settings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let search = localStorage.getItem(this.configService.config.storage.prefix + 'Search');
    if (search != null) {
      this.searchgroups = JSON.parse(search);
    }
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  download(item: SearchResultFileItem): void {
    this.authService.download(this.fileurl(item)).subscribe(blob => saveAs(blob, item.file.name));
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fileurl(item: SearchResultFileItem): string {
    return this.config.api.baseUrl + '/file/' + item.file.id + '/download';
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
      this.showgroup = params.get('tab') ?? 'notes';
      this.phrase = params.get('phrase') ?? '';
      this.searchphrase = params.get('phrase') ?? '';
      this.searchtoken = params.get('token') ?? '';
      this.urltoken = params.get('token') ?? '';
      this.onSearch(false, (params.get('token') ?? ''));
    });
  }

  reset(): void {
    this.resultcount = 0;
    this.resultgroupcount = {};
    this.searchresults = {};
  }

  onSearch(formSubmit: boolean, token: string = ''): void {
    if (this.phrase === '')
      return;
    if (this.busy)
      return;
    this.busy = true;

    localStorage.setItem(this.configService.config.storage.prefix + 'Search', JSON.stringify(this.searchgroups));

    let storeitem = this.configService.getCacheItem('search__' + this.phrase + token);
    if (storeitem != null) {
      this.searchresults = storeitem;
      this.onSearchCompleted(formSubmit);
      return;
    }

    let phrase = this.phrase;
    this.reset();
    this.searchphrase = phrase;
    this.searchtoken = '' + Math.floor(Date.now() / 1000);
    for (let i = 0; i < this.searchgroups.length; i++) {
      let group = this.searchgroups[i];
      if (group['active'] === true) {
        this.searchactive.push(group['groupName']);
        let url = this.config.api.baseUrl + group['searchPath'];
        this.authService.updateApi(url, { search: phrase }).subscribe((reply) => {
          if (reply.success && reply.payload != null) {
            switch (group['groupName']) {
              case 'accounts':
                this.searchresults.accounts = <SearchResultAccountItem[]>reply.payload['items'];
                break;
              case 'cases':
                this.searchresults.cases = <SearchResultCaseItem[]>reply.payload['items'];
                break;
              case 'directories':
                this.searchresults.directories = <SearchResultDirectoryItem[]>reply.payload['items'];
                break;
              case 'files':
                this.searchresults.files = <SearchResultFileItem[]>reply.payload['items'];
                break;
              case 'notepad':
                this.searchresults.notes = <SearchResultNoteItem[]>reply.payload['items'];
                break;
              case 'pages':
                this.searchresults.pages = <SearchResultPageItem[]>reply.payload['items'];
                break;
            }
          }
          this.searchactive.splice(this.searchactive.indexOf(group['groupName']));
          let $this = this;
          clearTimeout(this.debounce);
          this.debounce = setTimeout(function () { $this.onSearchCompleted(formSubmit); }, 200);
        });
      }
    }
  }

  onSearchCompleted(formSubmit: boolean): void {
    this.resultcount = 0;
    this.resultgroupcount = {};
    for (let [key, obj] of Object.entries(this.searchresults)) {
      this.resultgroupcount[key] = Object.keys(obj).length;
      this.resultcount += this.resultgroupcount[key];
    }
    this.configService.setCacheItem('search__' + this.searchphrase + this.searchtoken, this.searchresults);
    if (this.urltoken !== this.searchtoken) {
      this.router.navigate(['/search', this.searchphrase, this.searchtoken]);
    }
    this.busy = false;
  }

}
