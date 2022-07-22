import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatchHeightModule} from '../shared/directives/match-height.directive';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileListComponent} from './profile-list/profile-list.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { PersonalComponent } from './personal/personal.component';
import { EducationComponent } from './education/education.component';
import { TeachComponent } from './teach/teach.component';
import { NavbarProfileComponent } from './shared/navbar/navbar.profile.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {InstructorRankPipe} from './shared/pipe/InstructorRank.pipe';
import {MembershipPipe} from './shared/pipe/membership.pipe';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {ContactPipe} from './shared/pipe/contact.pipe';
import {MaritalPipe} from './shared/pipe/marital.pipe';
import {GenderPipe} from './shared/pipe/gender.pipe';
import {EducationTypePipe} from './shared/pipe/educationType.pipe';
import {SharedModule} from '../shared/shared.module';
import {UiSwitchModule} from 'ngx-ui-switch';
import { NewEducationComponent } from './education/new-education/new-education/new-education.component';
import { AuthenticationRequestComponent } from './authentication-request/authentication-request.component';
import { AuthenticationRequestDetailComponent } from './authentication-request-detail/authentication-request-detail.component';
import { BulkRegistrationComponent } from './bulk-registration/bulk-registration.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import { BulkRegistrationReportListComponent } from './bulk-registration-report-list/bulk-registration-report-list.component';
import { BulkRegistrationReportDetailComponent } from './bulk-registration-report-detail/bulk-registration-report-detail.component';

@NgModule({
    declarations: [
        ProfileListComponent,
        ProfileDetailComponent,
        PersonalComponent,
        EducationComponent,
        TeachComponent,
        NavbarProfileComponent,
        InstructorRankPipe,
        MembershipPipe,
        ContactPipe,
        MaritalPipe,
        GenderPipe,
        EducationTypePipe,
        NewEducationComponent,
        AuthenticationRequestComponent,
        AuthenticationRequestDetailComponent,
        BulkRegistrationComponent,
        BulkRegistrationReportListComponent,
        BulkRegistrationReportDetailComponent

    ],
    exports: [
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        NgbModule,
        MatchHeightModule,
        TableModule,
        ReactiveFormsModule,
        TagInputModule,
        FormsModule,
        NgSelectModule,
        DpDatePickerModule,
        SharedModule,
        UiSwitchModule,
        AngularEditorModule
    ]
})
export class ProfileModule {

}
