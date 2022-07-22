import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {ToastrModule} from 'ngx-toastr';
import {AgmCoreModule} from '@agm/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {StoreModule} from '@ngrx/store';

import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {AppComponent} from './app.component';
import {ContentLayoutComponent} from './layouts/content/content-layout.component';
import {FullLayoutComponent} from './layouts/full/full-layout.component';

import {DragulaService} from 'ng2-dragula';
import {AuthService} from './shared/auth/auth.service';
import {AuthGuard} from './shared/auth/auth-guard.service';
import {ErrorInterceptor} from './shared/interceptors/ErrorInterceptor';
import {JwtInterceptor} from './shared/interceptors/JwtInterceptor';
import {SocketIoConfig} from 'ngx-socket-io/src/config/socket-io.config';
import {SocketIoModule} from 'ngx-socket-io';
import {EmojiFrequentlyService, EmojiSearch, PickerModule} from '@ctrl/ngx-emoji-mart';
import {EmojiService} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {ToastModule} from 'primeng/toast';
import {FilterService, MessageService} from 'primeng/api';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

const config: SocketIoConfig = {
    url: 'http://localhost:8000',
    options: {}
};


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent],
    imports: [
        BrowserAnimationsModule,

        SocketIoModule.forRoot(config),
        StoreModule.forRoot({}),
        AppRoutingModule,
        SharedModule,
        PickerModule,
        HttpClientModule,
        ToastModule,
        ToastrModule.forRoot(),
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AgmCoreModule.forRoot({
            apiKey: 'YOUR KEY'
        }),
        PerfectScrollbarModule
    ],
    providers: [
        AuthService,
        EmojiFrequentlyService,
        EmojiSearch,
        EmojiService,
        AuthGuard,
        MessageService,
        FilterService,
        DragulaService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
