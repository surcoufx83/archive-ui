import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { Directory } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'app-rootdir',
  templateUrl: './rootdir.component.html',
  styleUrls: ['./rootdir.component.scss']
})
export class DbRootdirComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  saving: boolean = false;
  dirs: Directory[] = [];
  sortAsc: boolean = true;
  sortBy: string = 'name';

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private formatService: FormatService) { }

  get config(): AppConfig {
    return this.configService.config;
  }

  formatDate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    let url: string = `${this.config.api.baseUrl}/directories/root`;
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined && reply.payload['dirs'] != undefined) {
        this.dirs = <Directory[]>reply.payload['dirs'];
        this.sort();
      }
    });
  }

  sort(field?: string, asc?: boolean): void {
    if (field != undefined)
      this.sortBy = field;
    if (asc != undefined)
      this.sortAsc = asc;
    switch (this.sortBy) {

      case 'id':
        this.dirs.sort((a, b) => { return (a.id > b.id ? 1 : a.id < b.id ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      case 'mtime':
        this.dirs.sort((a, b) => { return (a.mtime > b.mtime ? 1 : a.mtime < b.mtime ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'name';
        this.dirs.sort((a, b) => { return (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) * (this.sortAsc ? 1 : -1) });
    }
  }

}
