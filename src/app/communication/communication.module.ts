import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {SearchPipe} from '../shared/pipes/search.pipe';
import {CommunicationRoutingModule} from './communication-routing.module';
import {InboxComponent} from './inbox/inbox.component';
import {SharedModule} from '../shared/shared.module';
import {TaskboardNGRXComponent} from './task/taskboard-ngrx.component';
import {TaskDetailComponent} from './task/task-detail/task-detail.component';
import {TimeConverterPipe} from './task/share/pipe/timeConverter.pipe';
import {DragulaModule} from 'ng2-dragula';
import {NgSelectModule} from '@ng-select/ng-select';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import {StoreModule} from '@ngrx/store';
import {chatReducer} from './chat-ngrx/store/chat.reducers';
import {ChatComponent} from './chat-ngrx/chat-ngrx.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket/ticket-details/ticket-details.component';
import {TableModule} from 'primeng/table';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {UiSwitchModule} from 'ngx-ui-switch';
import {AnnouncementComponent} from './announcement/announcement.component';

@NgModule({
    declarations: [
        SearchPipe,
        InboxComponent,
        TaskboardNGRXComponent,
        TaskDetailComponent,
        TimeConverterPipe,
        ChatComponent,
        TicketListComponent,
        TicketDetailsComponent,
        AnnouncementComponent
    ],
    imports: [
        CommonModule,
        CommunicationRoutingModule,
        NgbModule,
        FormsModule,
        PerfectScrollbarModule,
        SharedModule,
        DragulaModule,
        ReactiveFormsModule,
        NgSelectModule,
        DpDatePickerModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        StoreModule.forFeature('chat', chatReducer),
        DpDatePickerModule,
        TableModule,
        PickerModule,
        UiSwitchModule
    ]
})
export class CommunicationModule {
}
