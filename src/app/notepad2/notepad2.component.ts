import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from '../utils/settings.service';
import { Note } from '../if';

@Component({
  selector: 'app-notepad2',
  templateUrl: './notepad2.component.html',
  styleUrls: ['./notepad2.component.scss']
})
export class Notepad2Component implements OnDestroy, OnInit {

  notes: WritableSignal<Note[]> = signal([]);

  subs: Subscription[] = [];

  constructor(
    private settingsService: SettingsService,
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.settingsService.notepadItems$.subscribe((newNotes) => {
      this.notes.set(Object.values(newNotes).sort((a, b) => `${a.pinned ? '0' : '9'}${a.title.toLocaleLowerCase()}`.localeCompare(`${b.pinned ? '0' : '9'}${b.title.toLocaleLowerCase()}`, undefined, { numeric: true })));
      console.log(this.notes())
    }));
  }

}
