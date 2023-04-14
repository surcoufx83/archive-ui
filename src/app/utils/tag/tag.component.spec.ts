import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { Tag } from 'src/app/if';
import { IconComponent } from '../icon/icon.component';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  let mockConfigService: ConfigService;
  let mockHttpClient: HttpClient;
  let mockTag: Tag = { id: 1, value: 'foo', created: '', modified: '', deleted: null };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [
        TagComponent,
        IconComponent,
      ]
    })
      .compileComponents();

    mockConfigService = TestBed.inject(ConfigService);
    mockHttpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(TagComponent);
    spyOnProperty(mockConfigService, 'config').and.returnValue(mockAppConfig);
    component = fixture.componentInstance;
    component.tag = mockTag;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain badge with correct classes', () => {
    let badge: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(badge).toBeTruthy();
    expect(badge.className).toEqual('badge bg-primary ps-2 pe-1 py-1');
    expect(badge.innerText.trim()).toEqual('foo');
  });

  it('should contain a correct button', () => {
    let button: HTMLElement = fixture.nativeElement.querySelector('span > button');
    expect(button).toBeTruthy();
    expect(button.className).toEqual('ms-1 btn btn-primary py-1 px-1');
    let icon: HTMLElement = fixture.nativeElement.querySelector('span > button > app-icon > i');
    expect(icon).toBeTruthy();
    expect(icon.className).toEqual('foo-x');
  });

});

let mockAppConfig: AppConfig = {
  api: {
    baseUrl: '',
    startUrl: ''
  },
  auth: {
    authUrl: '',
    authCheck: '',
    basic: { enabled: false, user: '', password: '' },
    oauth2: { enabled: false, items: {} }
  },
  icons: {
    x: 'foo-x',
  },
  loaded: true,
  navbar: {
    items: [],
    items2: [],
    financeitems: [],
    workitems: []
  },
  storage: { prefix: '' },
};
