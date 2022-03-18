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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  busy: boolean = false;
  inactivecases: Case[] = [];
  newfiles: File[] = [];
  usersettingsObj?: Settings;
  stats?: HomeStats;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    public router: Router,
    private userSettings: SettingsService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  filesize(size: number) : string {
    return _filesize(size);
  }

  fn(n: number, fd: number = 0) : string {
    return this.i18nService.formatNumber(n, {minimumFractionDigits: fd})
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.update();
  }

  update() : void {
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/home';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <HomeResponse>reply.payload;
        this.inactivecases = response.inactivecases;
        this.newfiles = response.inboxfiles;
        this.stats = response.stats;
      }
      this.busy = false;
      setTimeout(() => { this.update(); }, 60000);
    });
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
