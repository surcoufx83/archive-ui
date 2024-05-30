import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from '../utils/settings.service';
import { Note } from '../if';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-notepad2',
  templateUrl: './notepad2.component.html',
  styleUrls: ['./notepad2.component.scss']
})
export class Notepad2Component implements OnDestroy, OnInit {

  notes: WritableSignal<Note[]> = signal([]);
  selectedNote?: Note;
  editMode: boolean = false;

  subs: Subscription[] = [];

  constructor(
    private i18nService: I18nService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
  ) { }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.settingsService.notepadItems$.subscribe((newNotes) => {
      this.notes.set(Object.values(newNotes).sort((a, b) => `${a.pinned ? '0' : '9'}${a.title.toLocaleLowerCase()}`.localeCompare(`${b.pinned ? '0' : '9'}${b.title.toLocaleLowerCase()}`, undefined, { numeric: true })));
    }));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      this.selectedNote = map.has('id') ? this.settingsService.getNote(+map.get('id')!) ?? undefined : undefined;
      this.editMode = map.has('editor');
    }));
  }

}
