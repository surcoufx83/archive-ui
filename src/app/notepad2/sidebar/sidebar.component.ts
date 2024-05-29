import { Component, EventEmitter, Input, Output } from '@angular/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { Note } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';

@Component({
  selector: 'app-notepad2-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input({ required: true }) notes!: Note[];

  deleteNote?: Note;
  deleteSaving: boolean = false;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) {
    this.i18nService.setTitle('notepad2.title');
  }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  onDeletionConfirmed(note: Note): void {
    if (this.deleteSaving || !this.deleteNote)
      return;
    this.deleteSaving = true;
    let newnote: Note = { ...this.deleteNote };
    this.settingsService.deleteNote(newnote).pipe(first()).subscribe((r) => console.log(r));
  }

  onPinnedBtnClicked(note: Note, $event: MouseEvent): void {
    this.preventDefaultEvents($event);
    let newnote: Note = { ...note };
    newnote.pinned = !newnote.pinned;
    this.settingsService.updateNote(newnote).pipe(first()).subscribe();
  }

  preventDefaultEvents($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    $event.stopPropagation();
    $event.preventDefault();
  }

}
