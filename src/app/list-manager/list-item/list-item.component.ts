import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { List, ListItem } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import cronParser from 'cron-parser';
import { environment } from 'src/environments/environment.dev';

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
export class ListManagerListItemComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @Input({ required: true }) list!: List;
  @Input({ required: true }) editMode!: boolean;

  clonedListItem?: List;
  editableList = new FormGroup({
    title: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(256)] }),
    description: new FormControl<string>('', { validators: [Validators.maxLength(2048)] }),
    resetCron: new FormControl<string>('', { validators: [CronExpressionValidator()] }),
    style: new FormControl<'cb' | 'ol' | 'ul'>('cb', { validators: [Validators.required] }),
    checkedBelow: new FormControl<boolean>(true),
  });
  icons = environment.icons;
  saving: boolean = false;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) { }

  fcron(expr: string | null): string {
    return this.formatService.fcron(expr);
  }

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

  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngAfterViewInit(): void {
    const htmlItems = document.getElementsByClassName('editable-item');
    for (let i = 0; i < htmlItems.length; i++) {
      const index = parseInt(htmlItems[i].getAttribute('data-note-index') || '-1');
      if (this.clonedListItem?.items[index])
        htmlItems[i].textContent = this.clonedListItem?.items[index].content;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['list'])
      return;
    if (!this.clonedListItem || changes['list'].firstChange || changes['list'].currentValue.id != changes['list'].previousValue.id) {
      // Other list selected by user, modify current list.
      this.ngOnInit();
      this.ngAfterViewInit();
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
      style: list.listStyle,
      checkedBelow: list.checkedBelow
    });
  }

  onAddListItem(afterI?: number): void {
    const user = this.settingsService.getUser();
    if (user == null || !this.clonedListItem)
      return;
    let i: number | undefined;
    const newitem = {
      checked: false,
      checkedBy: null,
      content: ''
    };
    if (afterI && (afterI != this.clonedListItem.items.length - 1)) {
      this.clonedListItem.items.splice(afterI + 1, 0, newitem);
      i = afterI + 2;
    }
    else {
      i = this.clonedListItem.items.push(newitem);
    }
    setTimeout(() => {
      if (i)
        document.getElementById(`list-item-${i - 1}-content`)?.focus();
      this.onKeyUp();
    }, 10);
  }

  onCheckListItem(i: number): void {
    const user = this.settingsService.getUser();
    if (!this.clonedListItem || !this.clonedListItem.items[i] || user == null)
      return;
    const item = this.clonedListItem.items[i];
    if (item.checked === true)
      this.clonedListItem.items[i].checkedBy = {
        id: user.id,
        loginname: user.loginname
      };
    else
      this.clonedListItem.items[i].checkedBy = null;
    setTimeout(() => {
      this.onKeyUp();
    }, 10);
  }

  onDeleteListItem(i: number): void {
    if (!this.clonedListItem || !this.clonedListItem.items[i])
      return;
    this.clonedListItem.items.splice(i, 1);
    this.ngAfterViewInit();
    setTimeout(() => {
      this.onKeyUp();
    }, 10);
  }

  onItemTextKeydown(i: number, event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onAddListItem(event.shiftKey ? i - 1 : i);
    }
  }

  debounceOnKeyUp: any;
  debounceSavingOut: any;
  onKeyUp(): void {
    clearTimeout(this.debounceOnKeyUp);
    clearTimeout(this.debounceSavingOut);
    if ((this.saving && this.debounceSavingOut != undefined) || this.editableList.invalid || !this.clonedListItem)
      return;
    this.debounceOnKeyUp = setTimeout(() => {
      if (!this.clonedListItem || this.editableList.invalid)
        return;
      this.saving = true;
      this.clonedListItem.title = `${this.editableList.controls.title.value}`;
      this.clonedListItem.description = `${this.editableList.controls.description.value}`;
      this.clonedListItem.reset = {
        cron: this.editableList.controls.resetCron.value ?? null,
        selectedDate: this.clonedListItem.reset?.selectedDate ?? null
      }
      this.clonedListItem.listStyle = `${this.editableList.controls.style.value ?? 'cb'}`;
      this.clonedListItem.checkedBelow = this.editableList.controls.checkedBelow.value ?? true;
      this.settingsService.updateList(this.clonedListItem).pipe(first()).subscribe((newlist) => {
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
