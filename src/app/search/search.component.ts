import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../user/settings/settings.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  busy: boolean = false;
  searchphrase: string = '';
  searchresults: any;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService)
  { }

  get config() : AppConfig {
  return this.configService.config;
  }

  i18n(key: string) : string {
  return this.i18nService.i18n(key);
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap);
    this.route.paramMap.subscribe((params) => {
      console.log('SearchComponent', 'ngOnInit()', 'route.paramMap.subscribe', params);
      this.reset();
      this.search(params.get('phrase') ?? '');
    });
  }

  reset() : void {

  }

  search(phrase: string) : void {
    if (phrase === '')
      return;
    if (this.busy)
      return;
    this.busy = true;

    let url = this.config.api.baseUrl + '/search';
    this.authService.updateApi(url, { search: phrase }).subscribe((reply) => {
      console.log(reply);
      if (reply.success && reply.payload != null) {
        
      } else {
        
      }
      this.busy = false;
    });

  }

}
