import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { List, ListItem } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import cronParser from 'cron-parser';
import { environment } from 'src/environments/environment.dev';
import { format, isFuture, isToday, parseISO } from 'date-fns';
import { DropEvent } from 'angular-draggable-droppable';

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
  @Input({ required: true }) dragMode!: boolean;
  @Input({ required: true }) editMode!: boolean;

  clonedListItem?: List;
  draggingElement = signal<ListDragItem | null>(null);
  draggingOver = signal<string | null>(null);
  editableList = new FormGroup({
    title: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(256)] }),
    description: new FormControl<string>('', { validators: [Validators.maxLength(2048)] }),
    resetCron: new FormControl<string>('', { validators: [CronExpressionValidator()] }),
    resetDate: new FormControl<string>(''),
    style: new FormControl<'cb' | 'ol' | 'ul'>('cb', { validators: [Validators.required] }),
    checkedBelow: new FormControl<boolean>(true),
  });
  icons = environment.icons;
  lastCheckedIndex: number = -1;
  lastUncheckedIndex: number = -1;
  saving: boolean = false;
  private touchEndX = 0;
  private touchMoved = false;
  private touchStartX = 0;
  private touchTimeout: any;
  private virtualElement: HTMLElement | null = null;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) { }

  createVirtualElement(event: TouchEvent, i: number): void {
    const originalElement = document.getElementById(`list-item-${i}`);
    if (originalElement) {
      this.virtualElement = originalElement.cloneNode(true) as HTMLElement;
      this.virtualElement.classList.add('shadow');
      this.virtualElement.classList.add('border');
      this.virtualElement.classList.add('border-danger');
      this.virtualElement.classList.add('bg-light-subtle');
      this.virtualElement.style.position = 'fixed';
      this.virtualElement.style.left = `${event.changedTouches[0].pageX}px`;
      this.virtualElement.style.top = `${event.changedTouches[0].pageY}px`;
      this.virtualElement.style.width = `${originalElement.offsetWidth}px`;
      this.virtualElement.style.height = `${originalElement.offsetHeight}px`;
      this.virtualElement.style.opacity = `.93`;
      this.virtualElement.style.pointerEvents = 'none'; // Make sure the virtual element doesn't interfere with touch events
      document.body.appendChild(this.virtualElement);
    }
  }

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

  isSwipeLeft(): boolean {
    return this.touchStartX - this.touchEndX > 150;
  }

  isSwipeRight(): boolean {
    return this.touchEndX - this.touchStartX > 150;
  }

  moveVirtualElement(event: TouchEvent): void {
    if (this.virtualElement) {
      this.virtualElement.style.left = `${event.changedTouches[0].pageX}px`;
      this.virtualElement.style.top = `${event.changedTouches[0].pageY}px`;
    }
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
    if (changes['list'])
      this.ngOnChangesList(changes['list']);
  }

  ngOnChangesList(listChange: SimpleChange): void {
    if (!this.clonedListItem || listChange.firstChange || listChange.currentValue.id != listChange.previousValue.id) {
      // Other list selected by user, modify current list.
      this.ngOnInit();
      this.ngAfterViewInit();
    }
    else if (this.editableList && listChange.currentValue.id === listChange.previousValue.id) {
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
    this.resetItemIndexVars();
    this.patchForm(this.clonedListItem);
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
    this.resetItemIndexVars();
    setTimeout(() => {
      this.onKeyUp();
    }, 1);
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

  onDragEnd(event: DragEvent): void {
    this.draggingElement.set(null);
    this.draggingOver.set(null);
  }

  onDragLeave(event: DragEvent): void {
    this.draggingOver.set(null);
    event.preventDefault();
  }

  onDragOver(event: DragEvent): void {
    if (event.target) {
      this.draggingOver.set((<HTMLElement>event.target).id);
    }
    event.preventDefault();
  }

  onDragStart(i: number, listElementId: string, event: DragEvent): void {
    if (!event.dataTransfer)
      return;
    this.draggingElement.set({
      index: i,
      listElementId: listElementId,
      listElementRef: document.getElementById(listElementId),
    });
    event.dataTransfer.clearData();
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text', listElementId);
  }

  onDrop(event: DragEvent | TouchEvent, placeAfter: number | null, placeBefore: number | null): void {
    const dragging = this.draggingElement();
    const targetindex = (placeAfter ?? placeBefore)!;
    if (
      !dragging ||
      !this.clonedListItem?.items[dragging.index] ||
      !this.clonedListItem?.items[targetindex]
    )
      return;

    const item = this.clonedListItem.items.splice(dragging.index, 1);
    if (item.length === 1) {
      this.clonedListItem.items.splice(
        placeBefore && targetindex > dragging.index ? targetindex - 1 : targetindex,
        0,
        item[0]
      );
      this.resetItemIndexVars();
      setTimeout(() => {
        this.onKeyUp();
      }, 1);
    }
    event.preventDefault();
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
        selectedDate: this.editableList.controls.resetDate.value ?? null
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

  onTouchEnd(event: TouchEvent): void {
    const dragging = this.draggingElement();
    if (dragging) {
      const targetId = this.draggingOver();
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        const placeAfter = parseInt(targetElement?.getAttribute('data-after') || '-1');
        const placeBefore = parseInt(targetElement?.getAttribute('data-before') || '-1');
        this.onDrop(
          new DragEvent('drop', {
            dataTransfer: new DataTransfer(),
          }),
          placeAfter !== -1 ? placeAfter : null,
          placeBefore !== -1 ? placeBefore : null
        );
      }
    }
    this.draggingElement.set(null);
    this.draggingOver.set(null);
  }

  onTouchEndSwipe(i: number): void {
    clearTimeout(this.touchTimeout);
    if (this.virtualElement && (this.isSwipeLeft() || this.isSwipeRight())) {
      this.onDeleteListItem(i);
    }
    this.removeVirtualElement();
  }

  onTouchMove(event: TouchEvent): void {
    if (this.draggingElement()) {
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains('drop-zone')) {
        this.draggingOver.set(target.id);
      }
      event.preventDefault();
    }
  }

  onTouchMoveSwipe(event: TouchEvent, i: number): void {
    this.touchMoved = true;
    clearTimeout(this.touchTimeout);
    this.touchEndX = event.changedTouches[0].screenX;
    if (this.virtualElement) {
      this.moveVirtualElement(event);
    } else if (Math.abs(this.touchStartX - this.touchEndX) > 10) {
      this.createVirtualElement(event, i);
    }
  }

  onTouchStart(i: number, listElementId: string, event: TouchEvent): void {
    this.draggingElement.set({
      index: i,
      listElementId: listElementId,
      listElementRef: document.getElementById(listElementId),
    });
    event.preventDefault();
  }

  onTouchStartSwipe(event: TouchEvent, i: number): void {
    this.touchMoved = false;
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchTimeout = setTimeout(() => {
      this.createVirtualElement(event, i);
    }, 200);
  }

  patchForm(list: List): void {
    this.editableList.patchValue({
      title: list.title,
      description: list.description,
      resetCron: list.reset?.cron ?? '',
      resetDate: list.reset?.selectedDate && (isToday(parseISO(list.reset?.selectedDate)) || isFuture(parseISO(list.reset?.selectedDate))) ? format(parseISO(list.reset?.selectedDate), 'yyyy-MM-dd') : '',
      style: list.listStyle,
      checkedBelow: list.checkedBelow
    });
  }

  removeVirtualElement(): void {
    if (this.virtualElement) {
      document.body.removeChild(this.virtualElement);
      this.virtualElement = null;
    }
  }

  resetItemIndexVars(): void {
    this.lastCheckedIndex = -1;
    this.lastUncheckedIndex = -1;
    if (!this.clonedListItem)
      return;
    for (let i = this.clonedListItem.items.length - 1; i >= 0; i--) {
      if (!this.clonedListItem.items[i].checked && this.lastUncheckedIndex == -1) {
        this.lastUncheckedIndex = i;
      }
      if (this.clonedListItem.items[i].checked && this.lastCheckedIndex == -1) {
        this.lastCheckedIndex = i;
      }
      if (this.lastCheckedIndex > -1 && this.lastUncheckedIndex > -1)
        break;
    }
  }

}

export type ListDragItem = {
  index: number,
  listElementId: string,
  listElementRef: HTMLElement | null,
}
