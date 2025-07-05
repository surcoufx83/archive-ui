import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { File } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnDestroy, OnInit {

  private subs: Subscription[] = [];

  busy = signal<boolean>(false);
  showFilterBar = signal<boolean>(false);
  files = signal<File[]>([]);
  icons = environment.icons;
  taxyear = signal<false | number>(false);

  constructor(
    private authService: AuthService,
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  i18n(key: string, params: any[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.route.paramMap.subscribe((pm) => {
      const year = pm.get('year');
      if (year !== null && +year > 2000 && +year < ((new Date()).getFullYear() + 3)) {
        this.taxyear.set(+year);
        this.updateFileList();
        return;
      }
      this.taxyear.set(false);
    }))
  }

  updateFileList(): void {
    const year = this.taxyear();
    if (!year || this.busy())
      return;

    this.busy.set(true);

    const sub = this.authService.queryApi(`api/fin/taxfiles/${year}`).subscribe((f) => {
      if (f.status === HttpStatusCode.Ok) {
        this.files.set((f.payload as TaxFilesResponse).files.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())));
      }

      setTimeout(() => {
        this.busy.set(false);
        sub?.unsubscribe();
      }, 0);
    });
  }

}

type TaxFilesResponse = {
  files: File[];
}