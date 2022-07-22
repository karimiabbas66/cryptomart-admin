import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';


import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {CustomizerComponent} from './customizer/customizer.component';
import {NotificationSidebarComponent} from './notification-sidebar/notification-sidebar.component';
import {ToggleFullscreenDirective} from './directives/toggle-fullscreen.directive';
import {SidebarDirective} from './directives/sidebar.directive';
import {SidebarLinkDirective} from './directives/sidebarlink.directive';
import {SidebarListDirective} from './directives/sidebarlist.directive';
import {SidebarAnchorToggleDirective} from './directives/sidebaranchortoggle.directive';
import {SidebarToggleDirective} from './directives/sidebartoggle.directive';
import {FieldTypePipe} from './pipes/field-type.pipe';
import {IslamicDatePickerComponent} from './date-picker/islamic/islamic-date-picker.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PersianDatePickerComponent} from './date-picker/persian/persian-date-picker.component';
import {GregorianDatePickerComponent} from './date-picker/english/gregorian-date-picker.component';
import {PersianDate} from './pipes/persian-date.pipe';
import {SafeHtmlPipe} from './pipes/safe-html-pipe';
import {ImageUploadComponent} from './image-upload/image-upload.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {UploaderComponent} from './upolader/uploader.component';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {EducationRateTypePipe} from './pipes/education-rate-type.pipe';
import {ProfileSearchComponent} from './profile-search/profile-search.component';
import {TableModule} from 'primeng/table';
import {CommentComponent} from './comment/comment.component';
import {RatingModule} from 'ng-starrating';
import {SafeImgPipe} from './pipes/safe-img-pipe';
import {FieldRequestTypePipe} from './pipes/field-request-type.pipe';
import {TicketCategoryPipe} from './pipes/ticket-category.pipe';
import {PersianDateNoDayPipe} from './pipes/persian-date-no-day.pipe';
import {SheetReportTypePipe} from './pipes/sheet-report-type.pipe';
import {ThesisLevelPipe} from './pipes/thesis-level.pipe';
import {ThesisAuthorTypePipe} from './pipes/thesis-author-type.pipe';
import {TicketStatePipe} from './pipes/ticket-state.pipe';
import {ReferTypePipe} from './pipes/refer-type.pipe';

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        SidebarDirective,
        NgbModule,
        TranslateModule,
        FieldTypePipe,
        IslamicDatePickerComponent,
        GregorianDatePickerComponent,
        PersianDatePickerComponent,
        SafeHtmlPipe,
        SafeImgPipe,
        SheetReportTypePipe,
        UploaderComponent,
        PersianDate,
        ImageUploadComponent,
        EducationRateTypePipe,
        ProfileSearchComponent,
        CommentComponent,
        FieldRequestTypePipe,
        TicketCategoryPipe,
        TicketStatePipe,
        ReferTypePipe,
        ThesisLevelPipe,
        ThesisAuthorTypePipe,
        PersianDateNoDayPipe
    ],
    entryComponents: [ProfileSearchComponent, CommentComponent],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule,
        PerfectScrollbarModule,
        FormsModule,
        RatingModule,
        FileUploadModule,
        ReactiveFormsModule,
        ImageCropperModule,
        TableModule,
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        SidebarDirective,
        SidebarLinkDirective,
        SidebarListDirective,
        SidebarAnchorToggleDirective,
        IslamicDatePickerComponent,
        PersianDatePickerComponent,
        GregorianDatePickerComponent,
        SidebarToggleDirective,
        FieldTypePipe,
        SheetReportTypePipe,
        SafeHtmlPipe,
        SafeImgPipe,
        PersianDate,
        EducationRateTypePipe,
        UploaderComponent,
        ImageUploadComponent,
        FieldRequestTypePipe,
        ProfileSearchComponent,
        CommentComponent,
        TicketCategoryPipe,
        TicketStatePipe,
        ReferTypePipe,
        ThesisLevelPipe,
        ThesisAuthorTypePipe,
        PersianDateNoDayPipe
    ]
})
export class SharedModule {
}
