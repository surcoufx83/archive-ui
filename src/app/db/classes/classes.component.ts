import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { Class } from 'src/app/files/class';
import { I18nService } from 'src/app/i18n.service';
import { Settings } from 'src/app/user/settings/settings';
import { SettingsService } from 'src/app/user/settings/settings.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class DbClassesComponent implements OnInit {

  @ViewChild('editor') editor?: ElementRef;

  busy: boolean = false;
  saving: boolean = false;
  classes: Class[] = [];
  editclass?: Class;
  usersettingsObj: Settings | null = null;
  sortAsc: boolean = true;
  sortBy: string = 'name';
  storagename: string = this.config.storage.prefix + 'dbclassesData';
  timeout?: any = undefined;
  when: number = 0;

  constructor(private configService: ConfigService,
    private i18nService: I18nService,
    private userSettings: SettingsService) {
    let olddata: string | null | DbClassesStorage = localStorage.getItem(this.storagename);
    if (olddata) {
      this.classes = (<DbClassesStorage>JSON.parse(olddata)).items;
      this.sort();
    }
    this.userSettings.loadArchiveSettings();
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.userSettings.classes$.subscribe((classes) => {
      if (classes.length == 0)
        return;
      this.classes = classes;
      this.classes.forEach((item) => { item.name = this.i18n('classify.classes.' + item.techname) });
      this.sort();
      localStorage.setItem(this.storagename, JSON.stringify({ items: this.classes }));
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  edit(item?: Class): void {
    if (item)
      this.editclass = { ...item };
    else
      this.editclass = {
        description: '', email: '', id: 0, isdefault: false,
        name: '', namepattern: '', techname: ''
      };
    if (this.editor && this.editor.nativeElement) {
      window.scrollTo(0, this.editor.nativeElement.offsetTop - 64);
    }
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
  }

  sort(): void {
    switch (this.sortBy) {

      case 'techname':
        this.classes.sort((a, b) => { return (a.techname > b.techname ? 1 : a.techname < b.techname ? -1 : 0) * (this.sortAsc ? 1 : -1) });
        break;

      default:
        this.sortBy = 'name';
        this.classes.sort((a, b) => { return (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) * (this.sortAsc ? 1 : -1) });
    }
  }

  submit(): void {
    if (!this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.sendUpdate(), 500);
  }

  private sendUpdate(): void {
    if (!this.editclass)
      return;
    this.saving = true;
    this.userSettings.updateClass(this.editclass).subscribe((reply) => {
      if (reply != null)
        this.editclass!.id = reply.id;
      this.saving = false;
    });
  }

}

export interface DbClassesStorage {
  items: Class[]
}
