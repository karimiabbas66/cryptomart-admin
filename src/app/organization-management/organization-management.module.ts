import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationManagementRoutingModule } from './organization-management-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {ChartistModule} from 'ng-chartist';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatchHeightModule} from '../shared/directives/match-height.directive';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {ArchwizardModule} from 'angular-archwizard';
import {NgSelectModule} from '@ng-select/ng-select';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {CustomFormsModule} from 'ng2-validation';
import {SharedModule} from '../shared/shared.module';
import { OrganizationDetailComponent } from './organization-detail/organization-detail.component';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {SafeHtmlPipe} from '../shared/pipes/safe-html-pipe';
import { UniversityComponent } from './university/university.component';
import { EducationRateComponent } from './university/education-rate/education-rate.component';
import { EducationFieldComponent } from './university/education-field/education-field.component';
import { EducationOrgTypeComponent } from './university/education-org-type/education-org-type.component';
import { EducationOrgComponent } from './university/education-org/education-org.component';


@NgModule({
  declarations: [OrganizationListComponent,
    // SafeHtmlPipe,
    OrganizationDetailComponent,
    UniversityComponent,
    EducationRateComponent,
    EducationFieldComponent,
    EducationOrgTypeComponent,
    EducationOrgComponent],
  exports: [OrganizationListComponent],
  imports: [
    CommonModule,
    CommonModule,
    InputTextModule,
    ChartistModule,
    NgbModule,
    MatchHeightModule,
    TableModule,
    ReactiveFormsModule,
    TagInputModule,
    FormsModule,
    ArchwizardModule,
    NgSelectModule,
    FileUploadModule,
    DpDatePickerModule,
    CustomFormsModule,
    SharedModule,
    OrganizationManagementRoutingModule
  ]
})
export class OrganizationManagementModule { }
