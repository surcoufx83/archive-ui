import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../user/settings/settings.service';
import { Settings } from '../user/settings/settings';
import { WorkSettingsService } from './settings/work-settings.service';
import { WorkSettings } from './settings/work-settings';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
  providers: [ SettingsService, WorkSettingsService ]
})
export class WorkComponent implements OnInit {

  routeUrl: string = '';
  worksettingsObj?: WorkSettings;
  settingsObj?: Settings;

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router,
              private workSettings: WorkSettingsService,
              private settings: SettingsService)
  {
    console.log('WorkComponent');
    this.workSettings.workSettings$.subscribe((settings) => {
      console.log('WorkComponent', settings);
      this.worksettingsObj = settings;
    });
    this.settings.settings$.subscribe((settings) => {
      console.log('WorkComponent', settings);
      this.settingsObj = settings;
    });
  }

  config() : ConfigService {
    return this.configService;
  }

  i18n(key: string) : string {
    return this.i18nService.i18n(key);
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.routeUrl = this.router.routerState.snapshot.url;
    });

    let url1 = this.configService.ApiBaseUrl + '/user/settings';
    this.authService.queryApi(url1).subscribe((reply) => {
      if (reply.success && reply.payload != null)
        this.settings.update(<Settings>reply.payload['settings']);
    });

    let url2 = this.configService.ApiBaseUrl + '/work/settings';
    this.authService.queryApi(url2).subscribe((reply) => {
      if (reply.success && reply.payload != null)
        this.workSettings.update(<WorkSettings>reply.payload['settings']);
    });
  }

}
