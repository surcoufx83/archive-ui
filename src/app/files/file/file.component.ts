import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { format } from 'date-fns';
import * as saveAs from 'file-saver';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { AuthService } from '../../auth.service';
import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { Settings } from '../../user/settings/settings';
import { SettingsService } from '../../user/settings/settings.service';
import { File, Page, Version } from '../file';
import { FormatService } from 'src/app/utils/format.service';
import { FileService } from 'src/app/utils/file.service';
import { Address, ContactType, Party, PartyContact } from 'src/app/common';
import { ReplaySubject } from 'rxjs';
import { Case, CaseFiletype } from 'src/app/cases/case';
import { Class } from '../class';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @ViewChild('imgViewer') imgViewer?: ElementRef;
  @ViewChild('htmlViewer') htmlViewer?: ElementRef;
  @ViewChild(PdfJsViewerComponent) pdfViewer?: PdfJsViewerComponent;

  busy: boolean = false;
  changes: {[key: string]: any} = {};
  debounce?: any;
  file?: File;
  filecontent?: Blob;
  fileid: number = -1;
  recentVersion: Version|null|undefined;
  textcontent: string[] = [];
  usersettingsObj?: Settings;
  view: string = '';

  addresses: Address[] = [];
  cases: Case[] = [];
  classes: Class[] = [];
  clients: Party[] = [];
  contacts: PartyContact[] = [];
  contacttypes: ContactType[] = [];
  filetypes: CaseFiletype[] = [];
  parties: Party[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService,
    private fileService: FileService) {
    this.userSettings.loadArchiveSettings();
    this.userSettings.settings$.subscribe((settings) => { this.usersettingsObj = settings; });
    this.userSettings.addresses$.subscribe((addresses) => { this.addresses = addresses; });
    this.userSettings.cases$.subscribe((cases) => { this.cases = cases; });
    this.userSettings.classes$.subscribe((classes) => {
      this.classes = classes;
      this.classes.forEach((item) => {item.name = this.i18n('classify.classes.' + item.techname)});
      this.classes.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0  });
    });
    this.userSettings.clients$.subscribe((clients) => { this.clients = clients; });
    this.userSettings.contacts$.subscribe((contacts) => { this.contacts = contacts; });
    this.userSettings.contacttypes$.subscribe((contacttypes) => { this.contacttypes = contacttypes; });
    this.userSettings.filetypes$.subscribe((filetypes) => { this.filetypes = filetypes; });
    this.userSettings.parties$.subscribe((parties) => { this.parties = parties; });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  get displayable() : boolean {
    return this.fileService.displayable(this.recentVersion);
  }

  get downloadable() : boolean {
    return this.fileService.downloadable(this.recentVersion);
  }

  download() : void {
    if (this.file == null)
      return;
    let file = this.file;
    this.authService.download(this.fileurl).subscribe(blob => saveAs(blob, file.name));
  }

  private downloadFile(id: number): void {
    if (this.file != undefined && Object.keys(this.file.versions).length > 0) {
      this.recentVersion = this.version;
      if (this.recentVersion && !this.recentVersion.ext?.displayable) {
        this.busy = false;
        return;
      }
    }
    if (this.view !== 'preview') {
      this.busy = false;
      return;
    }
    if (this.file != undefined && this.recentVersion != undefined) {
      let url = this.config.api.baseUrl + '/file/' + id + '/download';
      this.authService.download(url).subscribe(async (reply) => {
        this.filecontent = reply;
        if (this.pdfViewer && this.recentVersion?.ext?.mimetype === 'application/pdf' && this.filecontent) {
          this.pdfViewer.pdfSrc = this.filecontent;
          this.pdfViewer.refresh();
        }
        else if (this.getViewer() === 'html' && this.htmlViewer != undefined) {
          let document = this.htmlViewer.nativeElement.contentWindow.document;
          document.open();
          document.write(await new Response(this.filecontent).text());
          document.close();
        }
        else if (this.getViewer() === 'img' && this.imgViewer != undefined) {
          let urlCreator = window.URL || window.webkitURL;
          let url = urlCreator.createObjectURL(await new Response(this.filecontent).blob());
          this.imgViewer.nativeElement.src = url;
        }
        else {
          let reader = new FileReader();
          this.textcontent = (await new Response(this.filecontent).text()).split('\n');
        }
      });      
    }
    else
      this.busy = false;
  }

  get fileurl(): string {
    return this.config.api.baseUrl + '/file/' + this.file?.id + '/download';
  }

  getViewer() : string {
    if (!this.recentVersion || !this.recentVersion.ext || !this.recentVersion.ext.mimetype)
      return 'plaintext';
    switch(this.recentVersion.ext.mimetype) {
      case 'application/pdf':
        return 'ng2-pdfjs-viewer';
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/tiff':
        return 'img';
      case 'text/html':
        return 'html';
      case 'application/xml':
      case 'text/css':
      case 'text/csv':
      case 'text/markdown':
      case 'text/plain':
      default:
        return 'plaintext';
    }
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  private loadFile(id: number): void {
    this.busy = true;
    this.file = undefined;
    this.filecontent = undefined;
    this.recentVersion = undefined;
    let key = 'file__' + id;
    let cachefile = this.configService.getCacheItem(key);
    this.changes = {};
    if (cachefile) {
      this.file = <File>cachefile;
      this.fileid = this.file.id;
      this.downloadFile(this.file.id);
      return;
    }
    let url = this.config.api.baseUrl + '/file/' + id;
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        this.file = <File>reply.payload['file'];
        this.fileid = this.file.id;
        this.configService.setCacheItem(key, this.file);
        this.downloadFile(this.file.id);
      }
      this.busy = false;
    });
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  get pages() : Page[]|null {
    return this.fileService.pages(this.file);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let showview = params.get('view');
      this.view = showview ?? '';
      let id = params.get('id');
      if (!id)
        return;
      this.loadFile(+id);
    });
  }

  setClassId() : void {
    this.file!.class = this.classes.find(item => item.id == this.file?.classid) ?? null;
    console.log(this.file);
    this.changes['classid'] = this.file!.classid != null ? +this.file!.classid : null;
    this.submitFile();
  }

  submitFile() : void {
    console.log(this.file)
    if (this.debounce)
      clearTimeout(this.debounce);
    if (Object.keys(this.changes).length == 0)
      return;
    this.debounce = setTimeout(() => {
      let url = this.config.api.baseUrl + '/file/' + this.file!.id;
      this.authService.updateApi(url, this.changes).subscribe((reply) => {
        console.log(reply);
      });
    }, 1000);
  }

  get version() : Version|null {
    return this.fileService.version(this.file);
  }

}
