import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../auth.service';
import { ConfigService, AppConfig } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { SettingsService } from '../../user/settings/settings.service';
import { Settings } from '../../user/settings/settings';
import { WorkLead, WorkProperties } from '../work';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class WorkLeadsComponent implements OnInit {

  busy: boolean = false;
  leads: WorkLead[] = [];
  leadsLoading: boolean = false;
  usersettingsObj?: Settings;
  workpropsObj?: WorkProperties;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private router: Router) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.workprops$.subscribe((workprops) => {
      this.workpropsObj = workprops;
      this.leads = workprops.leads.sort((a,b) => (b.date_reported > a.date_reported ? 1 : -1));
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date|string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  goto(lead?: WorkLead) : void {
    this.router.navigate(['work', 'lead', (lead == null ? 'new' : lead.id)]);
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
