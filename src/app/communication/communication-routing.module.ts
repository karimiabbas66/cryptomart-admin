import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InboxComponent} from './inbox/inbox.component';
import {TaskboardNGRXComponent} from './task/taskboard-ngrx.component';
import {TaskDetailComponent} from './task/task-detail/task-detail.component';
import {ChatComponent} from './chat-ngrx/chat-ngrx.component';
import {TicketListComponent} from './ticket/ticket-list/ticket-list.component';
import {TicketDetailsComponent} from './ticket/ticket-details/ticket-details.component';
import {AnnouncementComponent} from './announcement/announcement.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inbox',
        component: InboxComponent,
        data: {
          title: 'Inbox'
        }
      },
      {
        path: 'task-list',
        component: TaskboardNGRXComponent,
        data: {
          title: 'taskList'
        }
      },
      {
        path: 'task-detail',
        component: TaskDetailComponent,
        data: {
          title: 'taskDetail'
        }
      },
      {
        path: 'chat',
        component: ChatComponent,
        data: {
          title: 'chat'
        }
      },
      {
        path: 'announcement',
        component: AnnouncementComponent,
        data: {
          title: 'announcement'
        }
      },
      {
        path: 'ticket-list',
        component: TicketListComponent,
        data: {
          title: 'ticketList'
        }
      },
      {
        path: 'ticket-detail',
        component: TicketDetailsComponent,
        data: {
          title: 'ticketDetails'
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule { }
