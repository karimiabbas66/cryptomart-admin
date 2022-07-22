import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrganizationDetailComponent} from './organization-detail/organization-detail.component';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {UniversityComponent} from './university/university.component';

const routes: Routes = [
    {
        path: '',
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'organization-list',
                component: OrganizationListComponent,
                data: {
                    title: 'OrganizationList'
                }
            },
            {
                path: 'organization-detail',
                component: OrganizationDetailComponent,
                data: {
                    title: 'OrganizationDetail'
                }
            },
            {
                path: 'education-unit',
                component: UniversityComponent,
                data: {
                    title: 'education-unit'
                }
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
