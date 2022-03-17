import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { AuthService } from '../../auth.service';
import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { Settings } from '../../user/settings/settings';
import { SettingsService } from '../../user/settings/settings.service';
import { File, Version } from '../file';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @ViewChild('htmlViewer') htmlViewer?: ElementRef;
  @ViewChild(PdfJsViewerComponent) pdfViewer?: PdfJsViewerComponent;

  busy: boolean = false;
  file?: File;
  filecontent?: Blob;
  fileid: number = -1;
  recentVersion?: Version;
  textcontent: string[] = [];
  usersettingsObj?: Settings;
  view: string = '';

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  private downloadFile(id: number): void {
    if (this.view !== 'preview') {
      this.busy = false;
      return;
    }
    if (this.file != undefined && Object.keys(this.file.versions).length > 0) {
      this.recentVersion = this.file.versions[+(Object.keys(this.file.versions)[Object.keys(this.file.versions).length - 1])];
      if (!this.recentVersion.ext?.displayable) {
        this.busy = false;
        return;
      }
      let url = this.config.api.baseUrl + '/file/' + id + '/download';
      this.authService.download(url).subscribe(async (reply) => {
        this.filecontent = reply;
        if (this.pdfViewer && this.recentVersion?.ext?.mimetype === 'application/pdf' && this.filecontent) {
          this.pdfViewer.pdfSrc = this.filecontent;
          this.pdfViewer.refresh();
        }
        else if (this.getViewer() === 'html' && this.htmlViewer != undefined) {
          console.log(this.getViewer());
          console.log(this.htmlViewer);
          let document = this.htmlViewer.nativeElement.contentWindow.document;
          document.open();
          document.write((await new Response(this.filecontent).text()));
          document.close();
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

  getViewer() : string {
    if (!this.recentVersion || !this.recentVersion.ext || !this.recentVersion.ext.mimetype)
      return 'plaintext';
    switch(this.recentVersion.ext.mimetype) {
      case 'application/pdf':
        return 'ng2-pdfjs-viewer';
      case 'text/html':
        return 'html';
      default:
        return 'plaintext';
    }
  }

}
