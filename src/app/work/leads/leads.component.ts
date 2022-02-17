import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth.service';
import { ConfigService, AppConfig } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { SettingsService } from '../../user/settings/settings.service';
import { Settings } from '../../user/settings/settings';
import { ApiReply } from '../../api-reply';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class WorkLeadsComponent implements OnInit {

  busy: boolean = false;
  leadsLoading: boolean = false;
  leads: any[] = [];
  usersettingsObj?: Settings;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  ngOnInit(): void {
    
  }

}
