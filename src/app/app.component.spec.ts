import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { I18nService } from './i18n.service';

describe('AppComponent', () => {

    let mockAuthService: AuthService;
    let mockConfigService: ConfigService;
    let mockI18nService: I18nService;
    let mockRouter: Router;
    let mockHttpClient: HttpClient;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
            declarations: [
                AppComponent
            ]
        }).compileComponents();
        mockAuthService = TestBed.inject(AuthService);
        mockConfigService = TestBed.inject(ConfigService);
        mockI18nService = TestBed.inject(I18nService);
        mockRouter = TestBed.inject(Router);
        mockHttpClient = TestBed.inject(HttpClient);
        spyOn<ConfigService, any>(mockConfigService, 'config').and.throwError('Test');
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

});