import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Case, File, UserSettings } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth.service';
import { I18nService } from '../i18n.service';
import { FormatService } from '../utils/format.service';
import { SettingsService } from '../utils/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  busy: boolean = false;
  etag?: string;
  icons = environment.icons;
  inactivecases: Case[] = [];
  inboxfiles: File[] = [];
  recentfiles: File[] = [];
  stats?: HomeStats;
  storagename: string = `${environment.localStoragePrefix}homeData`;
  updatetimeout: any;
  usersettingsObj: UserSettings | null = null;
  when: number = 0;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    public formatService: FormatService,
    public router: Router,
  ) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let olddata: string | null | HomeStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <HomeStorage>JSON.parse(olddata);
      this.inactivecases = olddata.inactivecases;
      this.inboxfiles = olddata.inboxfiles;
      this.recentfiles = olddata.recentfiles;
      this.stats = olddata.stats;
      this.etag = olddata.etag;
    }
    this.i18nService.setTitle('home.title');
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

  update(): void {
    this.busy = true;
    let url: string = `${environment.api.baseUrl}/home`;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url, undefined, this.etag).pipe(first()).subscribe((reply) => {
      if (reply.status == HttpStatusCode.Ok && reply.success && reply.payload != undefined) {
        let response = <HomeResponse>reply.payload;
        this.inactivecases = response.inactivecases;
        this.inboxfiles = response.inboxfiles;
        this.recentfiles = response.recentfiles;
        this.stats = response.stats;
        this.etag = reply.etag;
        localStorage.setItem(this.storagename, JSON.stringify(<HomeStorage>{
          inactivecases: this.inactivecases,
          inboxfiles: this.inboxfiles,
          recentfiles: this.recentfiles,
          stats: this.stats,
          etag: reply.etag,
        }));
      }
      this.busy = false;
      this.updatetimeout = setTimeout(() => { this.update(); }, 60000);
    });
  }

  update_addInactiveCase(c: Case): void {
    let changeindex = -1;
    for (let i = 0; i < this.inactivecases.length - 1; i++) {
      if (this.inactivecases[i].id == c.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.inactivecases[changeindex] = c;
    else
      this.inactivecases.push(c);
  }

  update_addFile(f: File): void {
    let changeindex = -1;
    for (let i = 0; i < this.inboxfiles.length - 1; i++) {
      if (this.inboxfiles[i].id == f.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.inboxfiles[changeindex] = f;
    else
      this.inboxfiles.push(f);
  }

}

export interface HomeResponse {
  inactivecases: Case[];
  inboxfiles: File[];
  recentfiles: File[];
  stats: HomeStats;
}

export interface HomeStats {
  general: HomeGeneralStats;
  newfiles: HomeinboxfilesStats;
}

export interface HomeGeneralStats {
  addresses_count: number;
  cases_active_count: number;
  cases_count: number;
  cases_draft_count: number;
  cases_old_count: number;
  classes_count: number;
  dir_count: number;
  extensions_count: number;
  file_count: number;
  file_size_avg: number;
  file_size_max: number;
  file_size_min: number;
  file_size_total: number;
  file_with_caseid: number;
  file_with_classid: number;
  file_with_clientid: number;
  file_with_partyid: number;
  file_withmultipleversions_count: number;
  file_withocr_count: number;
  freespace: number;
  invoices_count: number;
  invoices_topay_count: number;
  parties_count: number;
  time: number;
  totalspace: number;
}

export interface HomeinboxfilesStats {
  count: number;
  month: number;
  newest: string;
  oldest: string;
  year: number;
}

export interface HomeStorage {
  inactivecases: Case[];
  inboxfiles: File[];
  recentfiles: File[];
  stats: HomeStats;
  etag?: string;
}
