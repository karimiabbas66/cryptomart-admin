import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileListComponent} from './profile-list/profile-list.component';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';
import {PersonalComponent} from './personal/personal.component';
import {EducationComponent} from './education/education.component';
import {TeachComponent} from './teach/teach.component';
import {NewEducationComponent} from './education/new-education/new-education/new-education.component';
import {AuthenticationRequestComponent} from './authentication-request/authentication-request.component';
import {AuthenticationRequestDetailComponent} from './authentication-request-detail/authentication-request-detail.component';
import {BulkRegistrationComponent} from './bulk-registration/bulk-registration.component';
import {BulkRegistrationReportListComponent} from './bulk-registration-report-list/bulk-registration-report-list.component';
import {BulkRegistrationReportDetailComponent} from './bulk-registration-report-detail/bulk-registration-report-detail.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'profile-list',
                component: ProfileListComponent,
                data : {
                    title: 'ProfileList'
                }
            },
            {
                path: 'bulk-registration',
                component: BulkRegistrationComponent,
                data : {
                    title: 'BulkRegistration'
                }
            },
            {
                path: 'bulk-registration-report-list',
                component: BulkRegistrationReportListComponent,
                data : {
                    title: 'BulkRegistrationReportList'
                }
            },
            {
                path: 'bulk-registration-report-detail',
                component: BulkRegistrationReportDetailComponent,
                data : {
                    title: 'BulkRegistrationReportDetail'
                }
            },
            {
                path: 'profile-detail',
                component: ProfileDetailComponent,
                data: {
                    title: 'ProfileDetail'
                },
                // children: [
                //     {
                //         path: "profile",
                //         component: PersonalComponent,
                //     }
                // ]
            },
            {
                path: 'new-education',
                component: NewEducationComponent,
                data: {
                    title: 'NewEducation'
                },
            },
            {
                path: 'personal',
                component: PersonalComponent,
                data: {
                    title: 'Personal'
                }
            },
            {
                path: 'education',
                component: EducationComponent,
                data: {
                    title: 'Education'
                }
            },
            {
                path: 'teach',
                component: TeachComponent,
                data: {
                    title: 'Teach'
                }
            },
            {
                path: 'authentication-request-list',
                component: AuthenticationRequestComponent,
                data: {
                    title: 'AuthenticationRequestList'
                }
            },
            {
                path: 'authentication-request-detail',
                component: AuthenticationRequestDetailComponent,
                data: {
                    title: 'AuthenticationRequestDetail'
                }
            }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {
}
