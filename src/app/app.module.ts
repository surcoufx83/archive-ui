import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { I18nService } from './i18n.service';
import { CasesComponent } from './cases/cases.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FinanceComponent } from './finance/finance.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotepadComponent } from './notepad/notepad.component';
import { WorkComponent } from './work/work.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    DashboardComponent,
    CasesComponent,
    FinanceComponent,
    NotepadComponent,
    WorkComponent,
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
