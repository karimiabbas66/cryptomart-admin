import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderManagementRoutingModule } from './leader-management-routing.module';
import { LeaderListComponent } from './leader-list/leader-list.component';
import {NgbAccordionModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {PanelModule} from 'primeng/panel';
import { NewLeaderComponent } from './new-leader/new-leader.component';
import {LeaderGroupComponent} from './leader-group/leader-group.component';
import {NewLeaderGroupComponent} from './new-leader-group/new-leader-group.component';
import {TreeModule} from 'primeng/tree';
import { UserMemberComponent } from './user-member/user-member.component';
import {SharedModule} from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FieldAccessComponent } from './field-access/field-access.component';

@NgModule({
  declarations: [LeaderListComponent, NewLeaderComponent,LeaderGroupComponent,NewLeaderGroupComponent, UserMemberComponent, ForgotPasswordComponent, FieldAccessComponent],
    imports: [

        CommonModule,
        LeaderManagementRoutingModule,
        NgbAccordionModule,
        ReactiveFormsModule,
        NgSelectModule,
        DpDatePickerModule,
        PanelModule,
        NgbPaginationModule,
        FormsModule,
        TreeModule,
        SharedModule
    ],
    exports: [],
    providers: []
})
export class LeaderManagementModule { }
