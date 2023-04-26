import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { UserSettings, WorkLead } from 'src/app/if';
import { AuthService } from '../../auth.service';
import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { SettingsService } from '../../utils/settings.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class WorkLeadsComponent implements OnInit {

  busy: boolean = false;
  leads: WorkLead[] = [];
  leadsLoading: boolean = false;
  usersettingsObj: UserSettings | null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private router: Router) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.workLeads$.subscribe((leads) => {
      this.leads = Object.values(leads).sort((a, b) => (b.date_reported > a.date_reported ? 1 : -1));
    });
    this.i18nService.setTitle('leads.title');
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  goto(lead?: WorkLead): void {
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
