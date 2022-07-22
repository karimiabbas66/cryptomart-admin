import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ChartistModule } from 'ng-chartist';
import {NgbModal, NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "../shared/directives/match-height.directive";

import { FieldComponent } from "./field/field.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import {TableModule} from 'primeng/table';
import { FieldMetaComponent } from './field-meta/field-meta.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {NgSelectModule} from '@ng-select/ng-select';
import {CmsModule} from '../cms/cms.module';
import { FieldVisualizeComponent } from './field-tree-visualize/field-visualize.component';
import {FieldMapVisualizeComponent} from './field-map-visualize/field-map-visualize.component';
import { FieldDetailComponent } from './field-detail/field-detail.component';
import {SharedModule} from '../shared/shared.module';
import {SourcesModule} from '../sources/sources.module';
import {OrganizationManagementModule} from '../organization-management/organization-management.module';
import { ChangeFieldRequestComponent } from './change-field-request/change-field-request.component';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        TableModule,
        ReactiveFormsModule,
        TagInputModule,
        FormsModule,
        NgSelectModule,
        CmsModule,
        SourcesModule,
        OrganizationManagementModule,
        SharedModule,
        NgbModalModule
    ],
    exports: [
    ],
    declarations: [
        FieldComponent,
        Dashboard2Component,
        FieldMetaComponent,
        FieldVisualizeComponent,
        FieldMapVisualizeComponent,
        FieldDetailComponent,
        ChangeFieldRequestComponent,
    ],
    providers: [],
})
export class DashboardModule { }
