import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { UserSettings, WorkLead } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { I18nService } from '../../../i18n.service';
import { SettingsService } from '../../../utils/settings.service';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class WorkLeadComponent implements OnDestroy, OnInit {

  busy: boolean = false;
  icons = environment.icons;
  lead?: WorkLead | null;
  leadLoading: boolean = false;
  subscriptions: Subscription[] = [];
  usersettingsObj: UserSettings | null = null;

  constructor(
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private userSettings: SettingsService,
  ) {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.route.paramMap.subscribe(params => {
      this.busy = true;
      if (params.has('id')) {
        this.lead = this.userSettings.getWorkLead(+params.get('id')!);
      }
    }));
  }

  update(lead: WorkLead, push: boolean): void {
    console.log('WorkLeadComponent', 'update()', lead, push);

  }

}
