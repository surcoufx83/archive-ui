import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  onDeleteBtnClicked(note: Note, $event: MouseEvent): void {
    this.preventDefaultEvents($event);

  }

  onEditBtnClicked(note: Note, $event: MouseEvent): void {
    this.preventDefaultEvents($event);

  }

  onPinnedBtnClicked(note: Note, $event: MouseEvent): void {
    this.preventDefaultEvents($event);
    let newnote: Note = { ...note };
    newnote.pinned = !newnote.pinned;
    let tempsub = this.settingsService.updateNote(newnote).subscribe((n) => {
      if (n != null)
        tempsub.unsubscribe();
    });
  }

  preventDefaultEvents($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    $event.stopPropagation();
    $event.preventDefault();
  }

}
