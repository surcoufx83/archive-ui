import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { ConfigService, AppConfig } from '../../../config.service';
import { I18nService } from '../../../i18n.service';
import { SettingsService } from '../../../user/settings/settings.service';
import { Settings } from '../../../user/settings/settings';
import { WorkLead, WorkProperties } from '../../work';
import { format } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class WorkLeadComponent implements OnInit {

  busy: boolean = false;
  lead?: WorkLead;
  leadLoading: boolean = false;
  usersettingsObj?: Settings;
  workpropsObj?: WorkProperties;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService,
    private route: ActivatedRoute,
    private router: Router) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.workprops$.subscribe((workprops) => {
      this.workpropsObj = workprops;
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
        let url = this.configService.config.api.baseUrl + '/work/lead/' + (params.get('id') ?? 0);
        this.authService.queryApi(url).subscribe(reply => {
          if (reply.success && reply.payload != null) {
            this.update(reply.payload['lead'], false);
          }
          this.busy = false;
        });
      } else {
        this.update({
          id: 0,
          completed: false,
          date_accepted: null,
          date_completed: null,
          date_reported: (new Date()).toISOString(),
          cpo: { cpo_projectno: '', cpo_projectname: '' },
          customer: null,
          customerid: null,
          customer_name: '',
          incentive: {
            isincentive: false,
            incentive_completed: false,
            incentive_gross_value: 0.0,
            incentive_net_value: 0.0,
            incentive_paid: null,
            incentive_splitfactor: 100.0,
            incentive_value: 0.0
          },
          lead: {
            islead: false,
            lead_no: '',
            lead_text: '',
            opp_no: '',
            state: '',
            contract_value: 0.0,
            lead_gross_value: 0.0,
            lead_net_value: 0.0,
            lead_paid: null,
            lead_completed: false
          },
          paid: false,
          party: null,
          partyid: null,
          products: '',
          project_name: '',
          project_description: '',
          sales: '',
          userid: 1
        }, false);
        this.busy = false;
      }
    });
  }

  update(lead: WorkLead, push: boolean) : void {
    console.log('WorkLeadComponent', 'update()', lead, push);
    if (this.workpropsObj != undefined) {
      for(let i = 0; i < this.workpropsObj.leads.length; i++) {
        if (this.workpropsObj.leads[i].id === lead.id) {
          this.workpropsObj.leads[i] = lead;
          this.userSettings.updateWorkProps(this.workpropsObj, push);
        }
      }
    }
    this.lead = lead;
  }

}
