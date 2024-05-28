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
  navitems: NavbarItem[] = [
    {
      title: "navbar.workitems.today",
      icon: "today",
      link: "/work/today",
      matchLink: "/work/day"
    },
    {
      title: "navbar.workitems.month",
      icon: "calendar",
      link: "/work/month",
      matchLink: "/work/month"
    },
    {
      title: "navbar.workitems.year",
      icon: "year",
      link: "/work/year",
      matchLink: "/work/year"
    },
    {
      title: "navbar.workitems.leads",
      icon: "leads",
      link: "/work/leads"
    },
    {
      title: "navbar.workitems.settings",
      icon: "settings",
      link: "/work/settings"
    }
  ];

  constructor(private configService: ConfigService,
    private i18nService: I18nService,
    private settings: SettingsService) {
    this.settings.settings$.subscribe((settings) => {
      this.settingsObj = settings;
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
