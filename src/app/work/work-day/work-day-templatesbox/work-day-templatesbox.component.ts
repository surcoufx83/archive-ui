import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, Subscription } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { UserSettings, WorkDay, WorkDayBooking, WorkDayTemplate } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-work-day-templatesbox',
  templateUrl: './work-day-templatesbox.component.html',
  styleUrl: './work-day-templatesbox.component.scss'
})
export class WorkDayTemplatesboxComponent implements OnChanges, OnDestroy, OnInit {

  @Input({ required: true }) day!: WorkDay;
  @Input({ required: true }) today!: Date;
  @Input({ required: true }) usersettingsObj!: UserSettings;

  bookings: WorkDayBooking[] = [];
  existingTemplate?: WorkDayTemplate;
  icons = environment.icons;
  knownTemplateDays: number[] = [];
  saving = false;
  sub?: Subscription;
  templateForm = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required, Validators.maxLength(64)] }),
    flexitem: new FormControl<number>(-1, { validators: [Validators.required, Validators.min(0)] }),
  });

  constructor(
    private cache: SettingsService,
    private i18nService: I18nService,
  ) { }

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
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes The changes to the data-bound properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['day'] && changes['day'].currentValue) {
      const day = <WorkDay>changes['day'].currentValue;
      this.bookings = day.bookings ? Object.values(day.bookings) : [];
      this.loadExistingTemplate();
    }
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Unsubscribes from all subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Lifecycle hook that is called once, after the first ngOnChanges().
   * Initializes the component and subscribes to the work day templates.
   */
  ngOnInit(): void {
    this.sub = this.cache.workDayTemplates$.subscribe((templates) => {
      this.knownTemplateDays = Object.values(templates).map(t => t.content.origin.id);
      this.loadExistingTemplate();
    });
  }

  /**
   * Loads an existing template for the current day if it exists.
   */
  loadExistingTemplate(): void {
    if (!this.knownTemplateDays.includes(this.day.id)) {
      this.resetTemplate();
      return;
    }
    // day id in list of known templates
    const tempobj = this.cache.getWorkDayTemplateByDayId(this.day.id);
    if (!tempobj) {
      // but not found in cache??
      this.resetTemplate();
      return;
    }
    // found in cache
    this.existingTemplate = tempobj;
    this.templateForm.patchValue({
      name: this.existingTemplate.name,
      flexitem: this.existingTemplate.flexItem,
    });
  }

  /**
   * Resets the template form to its initial state.
   */
  resetTemplate(): void {
    this.existingTemplate = undefined;
    this.templateForm.patchValue({
      name: '',
      flexitem: -1,
    });
  }

  /**
   * When user inserts a template name and submits the form
   * this method is called. After checking the input, the
   * day data and template name are send to the backend to save the
   * template day.
   */
  onSubmitTemplateDay(): void {
    if (!this.templateForm.valid)
      return;
    const payload: WorkDayTemplate = {
      content: {
        origin: {
          date: this.day.date,
          day: this.day.day,
          id: this.day.id,
          month: this.day.month,
          monthid: this.day.monthid,
          note: this.day.note,
        },
        bookings: this.bookings,
      },
      created: '',
      deleted: null,
      flexItem: +this.templateForm.controls.flexitem.value!,
      id: this.existingTemplate?.id ?? 0,
      name: this.templateForm.controls.name.value!,
      updated: ''
    };
    this.saving = true;
    this.cache.updateWorkDayTemplate(payload).pipe(first()).subscribe((result) => {
      this.saving = false;
    });
  }

}
