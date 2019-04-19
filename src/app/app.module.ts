import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Redux
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store';

// Modules
import { GroupModule } from './components/group/group.module';
import { AgentModule } from './components/agent/agent.module';
import { VacationsModule } from './components/vacations/vacations.module';
import { PupilModule } from './components/pupil/pupil.module';
import { StatusModule } from './components/status/status.module';
import { SettingModule } from './components/setting/setting.module';
import { VacationSettingsModule } from './components/vacation-settings/vacation-settings.module';
import { StatisticModule } from './components/statistic/statistic.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { AsideComponent } from './components/aside/aside.component';
import { CodeComponent } from './components/code/code.component';
import { ErrorLogsComponent } from './components/error-logs/error-logs.component';
import { FooterComponent } from './components/footer/footer.component';

// Services
import { ConfigService } from './services/config/config.service';
import { HelperService } from './services/helper/helper.service';
import { FirebaseService } from './services/firebase/firebase.service';
import { CommonService } from './services/common.service';
import { UploadService } from './services/upload/upload.service';
import { RelationService } from './services/relation/relation.service';
import { ExcelService } from './services/excel/excel.service';

// Guards
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthAccountGuard } from './guards/auth-account.guard';

// Shared
import { SharedModule } from './shared/shared.module';
import { PupilDetailComponent } from './components/pupil-detail/pupil-detail.component';
import { MoneyPunishComponent } from './components/money-punish/money-punish.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        HeaderComponent,
        AsideComponent,
        CodeComponent,
        ErrorLogsComponent,
        PupilDetailComponent,
        MoneyPunishComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        NgReduxModule,
        HttpClientModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        GroupModule,
        AgentModule,
        SharedModule,
        VacationsModule,
        BrowserAnimationsModule,
        PupilModule,
        StatusModule,
        SettingModule,
        VacationSettingsModule,
        StatisticModule
    ],
    providers: [
        AuthAdminGuard,
        AuthAccountGuard,
        UploadService,
        ConfigService,
        FirebaseService,
        HelperService,
        CommonService,
        RelationService,
        ExcelService,
        {
            provide: APP_INITIALIZER,
            useFactory: appConfigFactory,
            deps: [ConfigService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(ngRedux: NgRedux<IAppState>) {
        ngRedux.configureStore(rootReducer, INITIAL_STATE);
    }
}

/**
 * Load config services
 */
export function appConfigFactory(config: ConfigService) {
    return () => config.load();
}

/**
 * Multile language
 */
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {

    return () => new Promise<any>((resolve: any) => {

        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

        locationInitialized.then(() => {
            const langToSet = 'en';
            translate.setDefaultLang(langToSet);
            translate.use(langToSet).subscribe(() => {

            }, err => {

            }, () => {
                resolve(null);
            });
        });

    });

}
