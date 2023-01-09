import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Route, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs';
import { ConfigService, NavbarItem } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { IconComponent } from '../icon/icon.component';
import { SubNavbarComponent } from './sub-navbar.component';

const sampleNavItem: NavbarItem[] = [
  { title: 'foo', link: '/bar', icon: 'ico' }
];

@Component({ selector: 'karma-home', template: '' })
export class KarmaTestComponent { }

const routes: Route[] = [
  { path: 'bar', component: KarmaTestComponent },
  { path: '**', component: KarmaTestComponent },
];

describe('SubNavbarComponent', () => {
  let component: SubNavbarComponent;
  let fixture: ComponentFixture<SubNavbarComponent>;
  let mockConfigService: any;
  let mockI18nService: any;
  let mockRouter: Router;

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj('ConfigService', [], { 'config': { 'icons': { 'ico': 'foo-icon' } } });
    mockI18nService = jasmine.createSpyObj('I18nService', ['i18n']);
    mockI18nService.i18n
      .withArgs('foo', [], 0).and.returnValue('foo-i18n-title');
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        FormsModule,
      ],
      declarations: [
        IconComponent,
        SubNavbarComponent
      ],
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        { provide: I18nService, useValue: mockI18nService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubNavbarComponent);
    mockRouter = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.navitems = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain basic elements', () => {
    expect(fixture.debugElement.query(By.css('header'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('header > nav.navbar'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('header > nav.navbar ul.navbar-nav'))).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('header > nav.navbar ul.navbar-nav li.nav-item')).length).toEqual(0);
  });

  it('should contain navitems', () => {
    component.navitems = sampleNavItem;
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('header > nav.navbar ul.navbar-nav li.nav-item')).length).toEqual(1);
    let navitem = fixture.debugElement.query(By.css('header > nav.navbar ul.navbar-nav li.nav-item'));
    expect(navitem.query(By.css('a.nav-link'))).toBeTruthy();
    expect(navitem.query(By.css('a.nav-link.active'))).toBeFalsy();
    expect(navitem.query(By.css('a.nav-link > app-icon'))).toBeTruthy();
    expect(navitem.query(By.css('a.nav-link > app-icon > i.foo-icon.me-1'))).toBeTruthy();
    expect(navitem.query(By.css('a.nav-link > span.d-none.d-md-inline'))).toBeTruthy();
    expect(navitem.query(By.css('a.nav-link > span.d-none.d-md-inline')).nativeElement.textContent.trim()).toEqual('foo-i18n-title');
  });

  it('should update active state of item on navigationEnd', fakeAsync(() => {
    component.navitems = sampleNavItem;
    fixture.detectChanges();
    let navitem = fixture.debugElement.query(By.css('header > nav.navbar ul.navbar-nav li.nav-item'));
    expect(navitem.query(By.css('a.nav-link'))).toBeTruthy();
    expect(navitem.query(By.css('a.nav-link.active'))).toBeFalsy();
    mockRouter.events.subscribe((e) => console.log(e))
    mockRouter.navigate(['/bar']);
    tick();
    fixture.detectChanges();
    expect(navitem.query(By.css('a.nav-link.active'))).toBeTruthy();
  }));

});
