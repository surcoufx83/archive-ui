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
import { Address, ButtonType, ContactType, Party, PartyContact } from 'src/app/common';
import { ReplaySubject } from 'rxjs';
import { Case, CaseFiletype } from 'src/app/cases/case';
import { Class } from '../class';
import { SelectedItem } from '../folder-browser-dialog/folder-browser-dialog.component';

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
  changes: { [key: string]: any } = {};
  debounce?: any;
  file?: File;
  filecontent?: Blob;
  fileid: number = -1;
  guessing: boolean = false;
  maxyear: number = new Date().getFullYear();
  recentVersion: Version | null | undefined;
  textcontent: string[] = [];
  updating: boolean = false;
  usersettingsObj: Settings|null = null;
  view: string = '';

  addresses: Address[] = [];
  cases: Case[] = [];
  casefilestatus: string[] = [];
  classes: Class[] = [];
  clients: Party[] = [];
  contacts: PartyContact[] = [];
  contacttypes: ContactType[] = [];
  filetypes: CaseFiletype[] = [];
  parties: Party[] = [];

  ai_classifiedAs: Class | null = null;
  ai_classifiedConfidence: number = 0.0;
  ai_classifiedAddress: Address | null = null;
  ai_classifiedAddressConfidence: number = 0.0;
  ai_classifiedCase: Case | null = null;
  ai_classifiedCaseConfidence: number = 0.0;
  ai_classifiedDate: string[] = [];

  showMoveToFolderBrowser: boolean = false;

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
    this.userSettings.addresses$.subscribe((addresses) => {
      this.addresses = Object.values(addresses);
      this.addresses.sort((a, b) => { return (a.name1 + a.street + a.zip + a.city).toLowerCase() > (b.name1 + b.street + b.zip + b.city).toLowerCase() ? 1 : (a.name1 + a.street + a.zip + a.city).toLowerCase() < (b.name1 + b.street + b.zip + b.city).toLowerCase() ? -1 : 0 });
    });
    this.userSettings.cases$.subscribe((cases) => {
      this.cases = Object.values(cases);
      this.cases.sort((a, b) => { return a.casepath > b.casepath ? 1 : a.casepath < b.casepath ? -1 : 0 });
    });
    this.userSettings.caseFileStatus$.subscribe((status) => { this.casefilestatus = status; });
    this.userSettings.classes$.subscribe((classes) => {
      this.classes = classes;
      this.classes.forEach((item) => { item.name = this.i18n('classify.classes.' + item.techname) });
      this.classes.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 });
    });
    this.userSettings.clients$.subscribe((clients) => {
      this.clients = Object.values(clients);
      this.clients.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0 });
    });
    this.userSettings.contacts$.subscribe((contacts) => { this.contacts = Object.values(contacts); });
    this.userSettings.contacttypes$.subscribe((contacttypes) => { this.contacttypes = Object.values(contacttypes); });
    this.userSettings.casefiletypes$.subscribe((filetypes) => {
      this.filetypes = [];
      for (let key in filetypes) {
        let item = filetypes[key];
        item.i18nname = this.i18n('casefiletypes.' + item.name);
        this.filetypes.push(item);
      }
      this.filetypes.sort((a, b) => { return a.i18nname > b.i18nname ? 1 : a.i18nname < b.i18nname ? -1 : 0 });
    });
    this.userSettings.parties$.subscribe((parties) => {
      this.parties = Object.values(parties);
      this.parties.sort((a, b) => { return a.name1 > b.name1 ? 1 : a.name1 < b.name1 ? -1 : 0 });
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  delete(file: File): void {
    if (window.confirm(this.i18n('file.housekeeping.delete.confirm'))) {
      this.busy = true;
      let url = this.config.api.baseUrl + '/file/' + file.id + '/delete';
      this.authService.updateApi(url, {}).subscribe((reply) => {
        if (reply.success) {
          this.file = undefined;
          this.nextFile();
        }
        else
          this.busy = false;
      });
    }

  }

  get displayable(): boolean {
    return this.fileService.displayable(this.recentVersion);
  }

  get downloadable(): boolean {
    return this.fileService.downloadable(this.recentVersion);
  }

  download(): void {
    if (this.file == null)
      return;
    let file = this.file;
    this.authService.download(this.fileurl).subscribe(blob => saveAs(blob, file.name));
  }

  private downloadFile(id: number): void {
    if (this.file == undefined)
      return;
    if (Object.keys(this.file.versions).length > 0) {
      this.recentVersion = this.version;
      if (this.recentVersion && !this.recentVersion.ext?.displayable) {
        this.busy = false;
        return;
      }
    }
    if (this.recentVersion != undefined) {
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

  getViewer(): string {
    if (!this.recentVersion || !this.recentVersion.ext || !this.recentVersion.ext.mimetype)
      return 'plaintext';
    switch (this.recentVersion.ext.mimetype) {
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

  guess(): void {
    let url = this.config.api.baseUrl + '/file/' + this.file!.id + '/guess';
    this.guessing = true;
    this.authService.updateApi(url, { classid: this.file!.classid }).subscribe((reply) => {
      if (reply && reply.payload && reply.payload['class']) {
        if (reply.payload['address']['address']) {
          this.ai_classifiedAddress = <Address>reply.payload['address']['address'];
          this.ai_classifiedAddressConfidence = +reply.payload['address']['confidence'];
        } else {
          this.ai_classifiedAddress = null;
        }
        if (reply.payload['class']['class']) {
          this.ai_classifiedAs = <Class>reply.payload['class']['class'];
          this.ai_classifiedConfidence = +reply.payload['class']['confidence'];
        } else {
          this.ai_classifiedAs = null;
        }
        if (reply.payload['case']['case']) {
          this.ai_classifiedCase = <Case>reply.payload['case']['case'];
          this.ai_classifiedCaseConfidence = +reply.payload['case']['confidence'];
        } else {
          this.ai_classifiedCase = null;
        }
        if (reply.payload['dates'] && reply.payload['dates'].length > 0) {
          this.ai_classifiedDate = reply.payload['dates'];
        } else {
          this.ai_classifiedDate = [];
        }
      }
      this.guessing = false;
    });
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
    this.ai_classifiedAddress = null;
    this.ai_classifiedAs = null;
    this.ai_classifiedCase = null;
    this.ai_classifiedDate = [];
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
      else
        alert("Error calling API :(");
      this.busy = false;
    });
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  moveTo(e: SelectedItem): void {
    console.log(e);
    if (e.clickedButton == ButtonType.Ok && this.file && e.selectedFolder) {
      let url = this.config.api.baseUrl + '/file/' + this.file.id + '/move';
      this.authService.updateApi(url, {
        folder: e.selectedFolder.id
      }).subscribe((reply) => {
        if (reply.success && reply.payload && reply.payload['file']) {
          this.file = <File>reply.payload['file'];
          let key = 'file__' + this.file.id;
          this.fileid = this.file.id;
          this.configService.setCacheItem(key, this.file);
          this.downloadFile(this.file.id);
        }
        else
          alert("Error calling API :(");
      });
    }
  }

  nextFile(): void {
    let url = this.config.api.baseUrl + '/file/next';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let id = <number>reply.payload['file'];
        if (id == this.file?.id)
          return;
        this.file = undefined;
        this.recentVersion = undefined;
        this.filecontent = undefined;
        this.ai_classifiedAs = null;
        this.ai_classifiedConfidence = 0.0;
        this.router.navigate(['/file', id]);
      }
      else
        alert("Error calling API :(");
    });
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

  get pages(): Page[] | null {
    return this.fileService.pages(this.file);
  }

  setCaseFilestatus(): void {
    this.changes['filestatus'] = this.file!.case_filestatus;
    this.submitFile();
  }

  setCaseFiletypeId(): void {
    this.file!.case_filetype = this.filetypes.find(item => item.id == this.file?.case_filetypeid) ?? null;
    this.changes['filetypeid'] = this.file!.case_filetypeid != null ? +this.file!.case_filetypeid : null;
    this.submitFile();
  }

  setCaseId(): void {
    this.file!.case = this.cases.find(item => item.id == this.file?.caseid) ?? null;
    this.changes['caseid'] = this.file!.caseid != null ? +this.file!.caseid : null;
    this.submitFile();
  }

  setClassId(): void {
    this.file!.class = this.classes.find(item => item.id == this.file?.classid) ?? null;
    this.changes['classid'] = this.file!.classid != null ? +this.file!.classid : null;
    this.submitFile();
  }

  setClientId(): void {
    this.file!.client = this.clients.find(item => item.id == this.file?.clientid) ?? null;
    this.changes['clientid'] = this.file!.clientid != null ? +this.file!.clientid : null;
    this.submitFile();
  }

  setPartyAddressId(): void {
    this.file!.partyaddress = this.addresses.find(item => item.id == this.file?.partyaddressid) ?? null;
    this.changes['partyaddressid'] = this.file!.partyaddressid != null ? +this.file!.partyaddressid : null;
    this.submitFile();
  }

  submitFile(): void {
    if (this.debounce)
      clearTimeout(this.debounce);
    if (Object.keys(this.changes).length == 0)
      return;
    this.debounce = setTimeout(() => {
      this.updating = true;
      let url = this.config.api.baseUrl + '/file/' + this.file!.id;
      this.authService.updateApi(url, this.changes).subscribe((reply) => {
        this.updating = false;
      });
    }, 500);
  }

  get version(): Version | null {
    return this.fileService.version(this.file);
  }

}

export interface ClassifyReply {
  class: ClassifyClassReply;
}

export interface ClassifyClassReply {
  determinedClass: string | null;
  confidence: number;
}