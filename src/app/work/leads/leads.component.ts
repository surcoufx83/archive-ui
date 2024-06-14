import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { UserSettings, WorkLead } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { I18nService } from '../../i18n.service';
import { SettingsService } from '../../utils/settings.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class WorkLeadsComponent implements OnDestroy, OnInit {

  busy: boolean = false;
  icons = environment.icons;
  leads: WorkLead[] = [];
  leadsLoading: boolean = false;
  subscriptions: Subscription[] = [];
  usersettingsObj: UserSettings | null = null;

  constructor(
    private i18nService: I18nService,
    private router: Router,
    private userSettings: SettingsService,
  ) {
    this.i18nService.setTitle('leads.title');
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.workLeads$.subscribe((leads) => {
      this.leads = Object.values(leads).sort((a, b) => (b.date_reported > a.date_reported ? 1 : -1));
    }));
  }

}
