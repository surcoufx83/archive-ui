import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { ApiReply, Meter } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.scss']
})
export class ReadingsComponent implements OnInit {

  busy: boolean = true;
  meter: Meter[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) {

  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.authService.queryApi(this.configService.config.api.baseUrl + '/meter').subscribe((reply: ApiReply) => {
      if (reply.payload && reply.payload['meter']) {
        this.meter = (<Meter[]>(reply.payload['meter'])).sort((a, b) => this.sortMeter(a, b));
        
      }
    });
  }

  sortMeter(a: Meter, b: Meter): number {
    if (a.name > b.name) {
      return 1;
    } else if (a.name == b.name) {
      return a.number > b.number ? 1 : -1;
    } else {
      return -1;
    }
  }

}
