import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { User, WorkTravel, WorkTravelDay } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class WorkTravelEditorComponent {

  editmode: boolean = false;
  editform = new FormGroup({
    user: new FormControl<number>(0, { validators: [Validators.required] }),
    reason: new FormControl<string>('', { validators: [Validators.required, Validators.maxLength(1024)] }),
    location: new FormControl<string>('', { validators: [Validators.required, Validators.maxLength(255)] }),
    city: new FormControl<string>('', { validators: [Validators.required, Validators.maxLength(255)] }),
    country: new FormControl<number>(0, { validators: [Validators.required] }),
  });
  icons = environment.icons;
  saving: boolean = false;
  otherUsers: User[] | null = this.dataService.getOtherUsers();
  travel: WorkTravel | null = null;
  travelDays: WorkTravelDay[] = [];
  travelId: number | null = null;
  travelTitle = signal<string>('');
  user: User | null;
  private subs: Subscription[] = [];

  constructor(
    private dataService: SettingsService,
    private formatService: FormatService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.updateTitle();
    this.user = this.dataService.getUser();
    if (this.user != null) {
      this.editform.patchValue({ user: this.user.id });
    }
  }

  clearTravelData(): void {
    this.travel = null;
    this.travelId = null;
    this.editmode = false;
    this.router.navigate(['/work', 'travel']);
  }

  /**
   * Formats a date using the FormatService.
   * @see FormatService 
   * @param date The date to format.
   * @param form The format string.
   * @returns The formatted date string.
   */
  fdate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

  /**
   * Formats the distance between two dates into a human-readable string.
   * @param date The target date.
   * @param baseDate The base date to compare with.
   * @param suffix Whether to add a suffix to the formatted string.
   * @returns The formatted distance string or a placeholder if dates are null.
   */
  fdist2(date: Date | string | null, baseDate: Date | string | null, suffix: boolean | undefined = undefined): string {
    return this.formatService.fdist2(date, baseDate, suffix);
  }

  /**
   * Translates a given key using the i18n service.
   * @param key The key to translate.
   * @param params Additional parameters for translation.
   * @returns The translated string.
   */
  i18n(key: string, params: any[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from all subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Subscribes to work travel data and sorts it by end time in descending order.
   */
  ngOnInit(): void {
    this.subs.push(this.dataService.workTravel$.subscribe((travels) => {
      console.log('dataService.workTravel$', travels, this.travelId)
      if (this.travelId !== null && this.travelId !== null && travels[this.travelId] !== undefined) {
        this.updateTravelData(travels[this.travelId]);
      }
    }));
    this.subs.push(this.route.paramMap.subscribe((map) => {
      console.log('dataService.workTravel$', map, this.travelId)
      const travelid = map.get('id');
      if (travelid === null) {
        this.router.navigate(['/work', 'travel'])
        return;
      }
      const travel = this.dataService.getWorkTravelItem(+travelid);
      if (travel === null) {
        this.router.navigate(['/work', 'travel'])
        return;
      }
      this.travelId = +travelid;
      this.updateTravelData(travel);
    }));
  }

  updateTitle(): void {
    let titleStr = '';
    if (this.travel === null)
      titleStr = this.i18nService.setTitle('travel.pagetitle');
    else
      titleStr = this.i18nService.setTitle('travel.pagetitleWithObj', [
        `${this.formatService.titleCase(this.travel.user.loginname)}${this.travel.user.loginname.endsWith('s') ? '\'' : 's'}`,
        `${this.travel.location}${this.travel.location != '' && this.travel.city != '' ? ', ' : ''}${this.travel.city}`
      ]);
    this.travelTitle.set(titleStr);
  }

  updateTravelData(travel: WorkTravel): void {
    console.log(travel)
    this.travel = { ...travel };
    this.updateTitle();
    if (!this.editmode) {
      this.editform.patchValue({
        reason: this.travel.reason,
        location: this.travel.location,
        city: this.travel.city,
        country: this.travel.country.id,
      });
      this.travelDays = [...this.travel.days];
      console.log(this.editform.value);
    }
  }

}
