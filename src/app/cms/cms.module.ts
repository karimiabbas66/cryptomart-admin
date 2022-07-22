import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BannerListComponent} from './banner-list/banner-list.component';
import {ChartistModule} from 'ng-chartist';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatchHeightModule} from '../shared/directives/match-height.directive';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {CmsRoutingModule} from './cms-routing.module';
import { BannerDetailComponent } from './banner-detail/banner-detail.component';
import {LoginTypePipe} from '../shared/pipes/login-type.pipe';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {SafeHtmlPipe} from '../shared/pipes/safe-html-pipe';
import { StaticPageListComponent } from './static-page-list/static-page-list.component';
import { StaticPageDetailComponent } from './static-page-detail/static-page-detail.component';
import {SharedModule} from '../shared/shared.module';
import { CustomNationalCodeValidatorDirective } from './custom-national-code-validator.directive';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ColorPickerModule} from 'ngx-color-picker';
import { LogoListComponent } from './logo-list/logo-list.component';
import { LogoDetailsComponent } from './logo-details/logo-details.component';

@NgModule({
    declarations: [
        BannerListComponent,
        BannerDetailComponent,
        LoginTypePipe,
        NewsListComponent,
        NewsDetailComponent,
        StaticPageListComponent,
        StaticPageDetailComponent,
        CustomNationalCodeValidatorDirective,
        LogoListComponent,
        LogoDetailsComponent
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        CmsRoutingModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        TableModule,
        ReactiveFormsModule,
        TagInputModule,
        FormsModule,
        FileUploadModule,
        DpDatePickerModule,
        SharedModule,
        AngularEditorModule,
        ColorSketchModule,
        ColorPickerModule
    ]
})
export class CmsModule {
}
