import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { UserSettings, WorkLead } from 'src/app/if';
import { AuthService } from '../../../auth.service';
import { AppConfig, ConfigService } from '../../../config.service';
import { I18nService } from '../../../i18n.service';
import { SettingsService } from '../../../utils/settings.service';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class WorkLeadComponent implements OnInit {

  busy: boolean = false;
  lead?: WorkLead | null;
  leadLoading: boolean = false;
  usersettingsObj: UserSettings | null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private route: ActivatedRoute,
    private router: Router) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.busy = true;
      if (params.has('id')) {
        this.lead = this.userSettings.getWorkLead(+params.get('id')!);
      }
    });
  }

  update(lead: WorkLead, push: boolean): void {
    console.log('WorkLeadComponent', 'update()', lead, push);

  }

}
