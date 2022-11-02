import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { AppConfig, ConfigService } from './config.service';
import { I18nService } from './i18n.service';
import { ToastContainerComponent } from './utils/toast-container/toast-container.component';
import { ToastComponent } from './utils/toast/toast.component';

describe('AppComponent', () => {

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    let mockAuthService: AuthService;
    let mockConfigService: ConfigService;
    let mockI18nService: I18nService;
    let mockRouter: Router;
    let mockHttpClient: HttpClient;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                FormsModule,
            ],
            declarations: [
                ToastContainerComponent,
                ToastComponent,
                AppComponent,
            ]
        }).compileComponents();
        mockAuthService = TestBed.inject(AuthService);
        mockConfigService = TestBed.inject(ConfigService);
        mockI18nService = TestBed.inject(I18nService);
        mockRouter = TestBed.inject(Router);
        mockHttpClient = TestBed.inject(HttpClient);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('should create the app', () => {
        expect(component).toBeTruthy();
        expect(component.routeUrl).toEqual('');
        expect(component.searchphrase).toEqual('');
    });

    it('should return config object', () => {
        expect(component.config).toEqual(mockConfigService.config);
    });

    it('should call i18nService correct', () => {
        const i18nspy = spyOn(mockI18nService, 'i18n').and.returnValue('bar');
        expect(component.i18n('foo')).toEqual('bar');
        expect(i18nspy).toHaveBeenCalledOnceWith('foo');
    });

    it('should call authService.isLoggedin correct', () => {
        spyOnProperty(mockAuthService, 'isLoggedin', 'get').and.returnValues(true, false);
        expect(component.isLoggedin).toEqual(true);
        expect(component.isLoggedin).toEqual(false);
    });

    it('should navigate always and to correct route (1)', () => {
        let navigatespy = spyOn(mockRouter, 'navigate');
        component.submitSearch();
        expect(navigatespy).toHaveBeenCalledOnceWith(['search']);
    });

    it('should navigate always and to correct route (2)', () => {
        let navigatespy = spyOn(mockRouter, 'navigate');
        component.searchphrase = 'foo';
        component.submitSearch();
        expect(navigatespy).toHaveBeenCalledOnceWith(['search', 'foo']);
    });

    it('should contain correct elements when logged out', () => {
        expect(fixture.debugElement.query(By.css('toast-container'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('header'))).toBeFalsy();
        expect(fixture.debugElement.query(By.css('router-outlet'))).toBeTruthy();
    });

    it('should contain correct elements when logged in', () => {
        spyOnProperty(mockConfigService, 'config').and.returnValue(mockAppConfig);
        spyOnProperty(mockAuthService, 'isLoggedin', 'get').and.returnValue(true);
        spyOn(mockI18nService, 'i18n')
            .withArgs('i18n.foo').and.returnValue('Foo Bar!')
            .withArgs('navbar.search.submit').and.returnValue('submit')
            .withArgs('navbar.search.placeholder').and.returnValue('placeholder');
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('toast-container'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('header'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('header > nav > div.container-fluid > div > ul.navbar-nav'))).toBeTruthy();
        let navitemslist = fixture.debugElement.query(By.css('header > nav > div.container-fluid > div > ul.navbar-nav'));
        let navitems = navitemslist.queryAll(By.css('li'))
        expect(navitems.length).toEqual(2);
        let navitem1 = navitems[0].query(By.css('a'));
        expect(navitem1.nativeElement).toHaveClass('active');
        expect(navitem1.nativeElement.href).toEqual(`${document.baseURI}foo`);
        expect(navitem1.query(By.css('i')).nativeElement).toHaveClass('bar');
        expect(navitem1.query(By.css('span')).nativeElement.textContent.trim()).toEqual('Foo Bar!');
        component.routeUrl = '/foo';
        fixture.detectChanges();
        expect(navitem1.nativeElement).not.toHaveClass('active');
        let navitem2 = navitems[1].query(By.css('a'));
        expect(navitem2.nativeElement).toHaveClass('active');
        expect(navitem2.nativeElement.href).toEqual(`${document.baseURI}search`);
        expect(navitem2.query(By.css('i')).nativeElement).toHaveClass('foo-search');
        expect(navitem2.query(By.css('span')).nativeElement.textContent.trim()).toEqual('submit');
        component.routeUrl = '/search';
        fixture.detectChanges();
        expect(navitem2.nativeElement).not.toHaveClass('active');
        expect(fixture.debugElement.query(By.css('header > nav > div.container-fluid > div:nth-child(2) > form'))).toBeTruthy();
        let form = fixture.debugElement.query(By.css('header > nav > div.container-fluid > div:nth-child(2) > form'));
        expect(form.query(By.css('div > label > i')).nativeElement).toHaveClass('foo-search');
        expect(form.query(By.css('div > input')).nativeElement.placeholder).toEqual('placeholder');
        expect(form.query(By.css('div > input')).nativeElement.value).toEqual('');
        expect(form.query(By.css('div > button')).nativeElement.textContent.trim()).toEqual('submit');
    });

    it('should set correct search field value', fakeAsync(() => {
        spyOnProperty(mockConfigService, 'config').and.returnValue(mockAppConfig);
        spyOnProperty(mockAuthService, 'isLoggedin', 'get').and.returnValue(true);
        fixture.detectChanges();
        let form = fixture.debugElement.query(By.css('header > nav > div.container-fluid > div:nth-child(2) > form'));
        expect(form.query(By.css('div > input')).nativeElement.value).toEqual('');
        component.searchphrase = 'foo';
        fixture.detectChanges();
        tick();
        expect(form.query(By.css('div > input')).nativeElement.value).toEqual('foo');
    }));

    it('should navigate on button click with empty search phrase', fakeAsync(() => {
        let navigatespy = spyOn(mockRouter, 'navigate');
        spyOnProperty(mockConfigService, 'config').and.returnValue(mockAppConfig);
        spyOnProperty(mockAuthService, 'isLoggedin', 'get').and.returnValue(true);
        fixture.detectChanges();
        let form = fixture.debugElement.query(By.css('header > nav > div.container-fluid > div:nth-child(2) > form'));
        form.query(By.css('div > button')).nativeElement.click();
        expect(navigatespy).toHaveBeenCalledOnceWith(['search']);
    }));

    it('should navigate on button click with search phrase', fakeAsync(() => {
        let navigatespy = spyOn(mockRouter, 'navigate');
        spyOnProperty(mockConfigService, 'config').and.returnValue(mockAppConfig);
        spyOnProperty(mockAuthService, 'isLoggedin', 'get').and.returnValue(true);
        component.searchphrase = 'foo';
        fixture.detectChanges();
        tick();
        let form = fixture.debugElement.query(By.css('header > nav > div.container-fluid > div:nth-child(2) > form'));
        form.query(By.css('div > button')).nativeElement.click();
        expect(navigatespy).toHaveBeenCalledOnceWith(['search', 'foo']);
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
        foo: 'bar',
        search: 'foo-search'
    },
    loaded: true,
    navbar: {
        items: [
            { title: 'i18n.foo', icon: 'foo', link: '/foo' }
        ],
        financeitems: [],
        workitems: []
    },
    storage: { prefix: '' },
};