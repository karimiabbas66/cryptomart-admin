import {NgModule} from '@angular/core';
import {UserReportComponent} from './user-report/user-report.component';
import {ReportRoutingModule} from './report-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {UiSwitchModule} from 'ngx-ui-switch';

@NgModule({
    declarations: [
        UserReportComponent
    ],
    exports: [],
    imports: [
        ReportRoutingModule,
        NgbModule,
        SharedModule,
        UiSwitchModule
    ]
})

export class ReportModule {

}
