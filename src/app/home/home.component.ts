import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _filesize from 'filesize';
import { AuthService } from '../auth.service';
import { Case } from '../cases/case';
import { AppConfig, ConfigService } from '../config.service';
import { File } from '../files/file';
import { I18nService } from '../i18n.service';
import { Settings } from '../user/settings/settings';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  busy: boolean = false;
  inactivecases: Case[] = [];
  newfiles: File[] = [];
  usersettingsObj: Settings | null = null;
  stats?: HomeStats;
  storagename: string = this.config.storage.prefix + 'homeData';
  when: number = 0;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    let olddata: string|null|HomeStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      olddata = <HomeStorage>JSON.parse(olddata);
      this.inactivecases = olddata.inactivecases;
      this.newfiles = olddata.inboxfiles;
      this.stats = olddata.stats;
    }
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.update();
  }

  update(): void {
    console.log(this.storagename);
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/home' + (this.when > 0 ? '/' + this.when : '');
    let clean = this.when == 0;
    this.when = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <HomeResponse>reply.payload;
        if (clean) {
          this.inactivecases = response.inactivecases;
          this.newfiles = response.inboxfiles;
        } else {
          response.inactivecases.forEach((a) => { this.update_addInactiveCase(a); });

          response.inboxfiles.forEach((a) => { this.update_addFile(a); });
          if (response.inboxfiles.length > 0)
            this.newfiles = this.newfiles.sort((a, b) => { return a.mtime < b.mtime ? 1 : a.mtime > b.mtime ? -1 : 0 });

        }
        this.stats = response.stats;
        localStorage.setItem(this.storagename, JSON.stringify({
          inactivecases: this.inactivecases,
          inboxfiles: this.newfiles,
          stats: this.stats
        }));
      }
      this.busy = false;
      this.userSettings.setTimeout(setTimeout(() => { this.update(); }, 60000));
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
    for (let i = 0; i < this.newfiles.length - 1; i++) {
      if (this.newfiles[i].id == f.id) {
        changeindex = i;
        break;
      }
    }
    if (changeindex > -1)
      this.newfiles[changeindex] = f;
    else
      this.newfiles.push(f);
  }

}

export interface HomeResponse {
  inactivecases: Case[];
  inboxfiles: File[];
  stats: HomeStats;
}

export interface HomeStats {
  general: HomeGeneralStats;
  newfiles: HomeNewFilesStats;
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

export interface HomeNewFilesStats {
  count: number;
  month: number;
  newest: string;
  oldest: string;
  year: number;
}

export interface HomeStorage {
  inactivecases: Case[];
  inboxfiles: File[];
  stats: HomeStats;
}
