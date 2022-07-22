import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {FieldComponent} from './field/field.component';
import {Dashboard2Component} from './dashboard2/dashboard2.component';
import {AuthGuard} from '../shared/auth/auth-guard.service';
import {FieldMetaComponent} from './field-meta/field-meta.component';
import {FieldVisualizeComponent} from './field-tree-visualize/field-visualize.component';
import {FieldMapVisualizeComponent} from './field-map-visualize/field-map-visualize.component';
import {FieldDetailComponent} from './field-detail/field-detail.component';
import {ChangeFieldRequestComponent} from './change-field-request/change-field-request.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'field',
                component: FieldComponent,
                data: {
                    title: 'field'
                }
            },
            {
                path: 'field-detail',
                component: FieldDetailComponent,
                data: {
                    title: 'field-detail'
                }
            },
            {
                path: 'field-tree-visualize',
                component: FieldVisualizeComponent,
                data: {
                    title: 'field-tree-visualize'
                }
            },
            {
                path: 'field-map-visualize',
                component: FieldMapVisualizeComponent,
                data: {
                    title: 'field-map-visualize'
                }
            },
            {
                path: 'change-field-request',
                component: ChangeFieldRequestComponent,
                data: {
                    title: 'change-field-request'
                }
            },
            {
                path: 'dashboard2',
                component: Dashboard2Component,
                data: {
                    title: 'Dashboard 2'
                }
            },
            {
                path: 'fieldMeta',
                component: FieldMetaComponent,
                data: {
                    title: 'fieldMeta'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {
}
