import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { Directory } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-rootdir',
  templateUrl: './rootdir.component.html',
  styleUrls: ['./rootdir.component.scss']
})
export class DbRootdirComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  dirs: Directory[] = [];
  icons = environment.icons;
  saving: boolean = false;
  sortAsc: boolean = true;
  sortBy: string = 'name';

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private formatService: FormatService
  ) { }

  formatDate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnInit(): void {
    let url: string = `${environment.api.baseUrl}/directories/root`;
    this.authService.queryApi(url).pipe(first()).subscribe((reply) => {
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
