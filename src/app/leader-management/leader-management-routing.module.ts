import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LeaderListComponent} from './leader-list/leader-list.component';
import {AuthGuard} from '../shared/auth/auth-guard.service';
import {NewLeaderComponent} from './new-leader/new-leader.component';
import {LeaderGroupComponent} from './leader-group/leader-group.component';
import {NewLeaderGroupComponent} from './new-leader-group/new-leader-group.component';
import {UserMemberComponent} from './user-member/user-member.component';

const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    children: [
        {
            path: 'leader-list',
            component: LeaderListComponent,
            data: {
                title: 'leaderList'
            }
        },
        {
            path: 'new-leader',
            component: NewLeaderComponent,
            data: {
                title: 'NewLeader'
            }
        },
        {
            path: 'leader-group',
            component: LeaderGroupComponent,
            data: {
                title: 'LeaderGroup'
            }
        }
        ,
        {
            path: 'new-leader-group',
            component: NewLeaderGroupComponent,
            data: {
                title: 'NewLeaderGroup'
            }
        },
        {
            path: 'user-member',
            component: UserMemberComponent,
            data: {
                title: 'UserMemberEntity'
            }
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaderManagementRoutingModule {
}
