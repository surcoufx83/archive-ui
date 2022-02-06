import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CasesComponent } from './cases/cases.component';
import { ConfigService } from './config.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FinanceComponent } from './finance/finance.component';
import { I18nService } from './i18n.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotepadComponent } from './notepad/notepad.component';
import { WorkComponent } from './work/work.component';
import { LoginCheckComponent } from './login-check/login-check.component';

@NgModule({
  declarations: [
    AccountComponent,
    AppComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    DashboardComponent,
    CasesComponent,
    FinanceComponent,
    NotepadComponent,
    WorkComponent,
    LoginCheckComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [ConfigService],
      multi: true,
      useFactory: (configService: ConfigService) => () => configService.loadAppConfig()
    },
    {
      provide: APP_INITIALIZER,
      deps: [I18nService],
      multi: true,
      useFactory: (i18nService: I18nService) => () => i18nService.loadLocalStrings(navigator.language.substr(0, 2))
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
