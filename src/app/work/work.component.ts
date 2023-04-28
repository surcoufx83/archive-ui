import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSettings } from 'src/app/if';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService, NavbarItem } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../utils/settings.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {

  settingsObj: UserSettings | null = null;
  navitems: NavbarItem[] = [];

  constructor(private configService: ConfigService,
    private i18nService: I18nService,
    private settings: SettingsService) {
    this.settings.settings$.subscribe((settings) => {
      this.settingsObj = settings;
      let tempar: NavbarItem[] = Object.assign([], this.config.navbar.workitems);
      if (!this.settingsObj?.work.leads.enabled) {
        for (let i = 0; i < tempar.length; i++) {
          if (tempar[i].link == '/work/leads') {
            tempar.splice(i, 1);
            break;
          }
        }
      }
      this.navitems = tempar;
    });
    this.i18nService.setTitle('work.pagetitle');
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string): string {
    return this.i18nService.i18n(key);
  }

  ngOnInit(): void { }

}
