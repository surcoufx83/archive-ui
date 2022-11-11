import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { IconComponent } from '../icon/icon.component';

import { SorterIconComponent } from './sorter-icon.component';

describe('SorterIconComponent', () => {
  let component: SorterIconComponent;
  let fixture: ComponentFixture<SorterIconComponent>;

  let mockConfigService: ConfigService;
  let mockHttpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [
        SorterIconComponent,
        IconComponent,
      ]
    })
      .compileComponents();

    mockConfigService = TestBed.inject(ConfigService);
    mockHttpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(SorterIconComponent);
    spyOnProperty(mockConfigService, 'config').and.returnValue(mockAppConfig);
    component = fixture.componentInstance;
    component.columnName = 'foo';
    component.sortBy = 'foo';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain icon with correct classes', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    expect(i).toBeTruthy();
    expect(i).toHaveClass('foo-asc');
    expect(i).toHaveClass('fs-7');
    expect(i).toHaveClass('me-1');
    expect(i).toHaveClass('pointer');
    expect(i).toHaveClass('text-primary');
  });

  it('should contain icon with correct classes after changing sortBy', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.sortBy = 'bar';
    fixture.detectChanges();
    expect(i).toBeTruthy();
    expect(i).toHaveClass('foo-asc');
    expect(i).toHaveClass('fs-7');
    expect(i).toHaveClass('me-1');
    expect(i).toHaveClass('pointer');
    expect(i).toHaveClass('text-muted');
  });

  it('should contain icon with correct classes after changing sortAsc', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.sortAsc = false;
    fixture.detectChanges();
    expect(i).toBeTruthy();
    expect(i).toHaveClass('foo-desc');
    expect(i).toHaveClass('fs-7');
    expect(i).toHaveClass('me-1');
    expect(i).toHaveClass('pointer');
    expect(i).toHaveClass('text-primary');
  });

  it('should contain icon with correct classes after changing sortAsc and sortBy', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.sortAsc = false;
    component.sortBy = 'bar';
    fixture.detectChanges();
    expect(i).toBeTruthy();
    expect(i).toHaveClass('foo-desc');
    expect(i).toHaveClass('fs-7');
    expect(i).toHaveClass('me-1');
    expect(i).toHaveClass('pointer');
    expect(i).toHaveClass('text-muted');
  });

  it('should call click fn', fakeAsync(() => {
    let span: HTMLElement = fixture.nativeElement.querySelector('span');
    spyOn(component.click, 'emit');
    span.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.click.emit).toHaveBeenCalled();
  }));

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
    sortasc: 'foo-asc',
    sortdesc: 'foo-desc'
  },
  loaded: true,
  navbar: {
    items: [],
    financeitems: [],
    workitems: []
  },
  storage: { prefix: '' },
};
