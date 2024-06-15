import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { List } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import cronParser from 'cron-parser';

export function CronExpressionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value === '')
      return null;
    try {
      cronParser.parseExpression(value);
      return null;
    }
    catch (e) {
    }
    return { invalidExpression: true };
  }
}

@Component({
  selector: 'app-list-manager-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListManagerListItemComponent implements OnChanges, OnDestroy, OnInit {

  @Input({ required: true }) list!: List;
  @Input({ required: true }) editMode!: boolean;

  clonedListItem?: List;
  editableList = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(256)] }),
    description: new FormControl('', { validators: [Validators.maxLength(2048)] }),
    resetCron: new FormControl('', { validators: [CronExpressionValidator()] }),
    resetDate: new FormControl(''),
    resetManually: new FormControl(true),
  });
  saving: boolean = false;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) { }

  fdate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

  fdist(date: Date | string | null, suffix: boolean | undefined = undefined): string {
    return this.formatService.fdist(date, suffix);
  }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get str(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['list'])
      return;
    if (!this.clonedListItem || changes['list'].firstChange || changes['list'].currentValue.id != changes['list'].previousValue.id) {
      // Other list selected by user, modify current list.
      this.clonedListItem = { ...this.list };
      this.patchForm(this.clonedListItem);
    }
    else if (this.editableList && changes['list'].currentValue.id === changes['list'].previousValue.id) {
      // If list already loaded, update metadata only, not title and content as this will break current editing.
      this.clonedListItem.deleted = this.list.deleted;
      this.clonedListItem.pinned = this.list.pinned;
      this.clonedListItem.private = this.list.private;
      this.clonedListItem.updated = this.list.updated;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceOnKeyUp);
  }

  ngOnInit(): void {
    this.clonedListItem = { ...this.list };
    this.patchForm(this.clonedListItem);
  }

  patchForm(list: List): void {
    this.editableList.patchValue({
      title: list.title,
      description: list.description,
      resetCron: list.reset?.cron ?? '',
      resetDate: list.reset?.date ?? '',
      resetManually: list.reset?.manually ?? true
    });
  }

  debounceOnKeyUp: any;
  onKeyUp(): void {
    clearTimeout(this.debounceOnKeyUp);
    if (this.saving || this.editableList.invalid || !this.clonedListItem)
      return;
    this.debounceOnKeyUp = setTimeout(() => {
      if (!this.clonedListItem || this.editableList.invalid)
        return;
      this.saving = true;
      this.clonedListItem.title = `${this.editableList.controls.title.value}`;
      this.clonedListItem.description = `${this.editableList.controls.description.value}`;
      this.clonedListItem.reset = {
        cron: this.editableList.controls.resetCron.value ?? null,
        date: this.editableList.controls.resetDate.value ?? null,
        manually: this.editableList.controls.resetManually.value ?? true
      }
      this.settingsService.updateList(this.clonedListItem).pipe(first()).subscribe((newlist) => {
        console.log(newlist)
        if (newlist !== true && newlist !== false)
          setTimeout(() => {
            if (this.clonedListItem)
              this.clonedListItem.updated = newlist.updated;
          }, 1);
        this.saving = false;
      });
    }, 500);
  }

}
