import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: any;
  private startUrl: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.startUrl = location.href.substr(location.href.indexOf('#') + 1);
  }

  loadAppConfig() {
    return this.http.get('/assets/config/config.json')
      .toPromise()
      .then(config => {
        this.appConfig = config;
      });
  }

  get AuthUrl() : string {
    return <string>this.appConfig.auth.authUrl;
  }

  get AuthCheckUrl() : string {
    return <string>this.appConfig.auth.authCheck;
  }

  get FirstUrl() : string {
    return this.startUrl;
  }

  get NavbarItems() : any[] {
    if (this.appConfig != undefined && this.appConfig.navbar !== undefined && this.appConfig.navbar.items !== undefined)
      return <any[]>this.appConfig.navbar.items;
    return [];
  }

  getIcon(iconName: string) : string {
    if (this.appConfig != undefined && this.appConfig.icons !== undefined && this.appConfig.icons[iconName] !== undefined)
      return <string>this.appConfig.icons[iconName];
    return 'fas fa-question';
  }

  get StoragePrefix() : string {
    return <string>this.appConfig.storage.prefix;
  }

  get WorkNavbarItems() : any[] {
    if (this.appConfig != undefined && this.appConfig.navbar !== undefined && this.appConfig.navbar.workitems !== undefined)
      return <any[]>this.appConfig.navbar.workitems;
    return [];
  }

}
