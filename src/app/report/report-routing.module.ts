import {RouterModule, Routes} from '@angular/router';
import {UserReportComponent} from './user-report/user-report.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'user-report',
                component: UserReportComponent,
                data: {
                    title: 'UserReport'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule {

}
