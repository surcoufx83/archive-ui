import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSettings } from 'src/app/if';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService, NavbarItem } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../user/settings/settings.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {

  routeUrl: string = '';
  settingsObj: UserSettings|null = null;

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router,
              private settings: SettingsService)
  {
    this.settings.settings$.subscribe((settings) => {
      this.settingsObj = settings;
    });
  }

  get config() : AppConfig {
    return this.configService.config;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.routeUrl = this.router.routerState.snapshot.url;
    });
  }

  onShowLink(item: NavbarItem) : boolean {
    if (item['link'] !== '/work/leads')
      return true;
    return (this.settingsObj?.work.leads.enabled ? true : false);
  }

}
