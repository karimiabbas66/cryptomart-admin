import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FullPagesRoutingModule} from './full-pages-routing.module';
import {ChartistModule} from 'ng-chartist';
import {AgmCoreModule} from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {GalleryPageComponent} from './gallery/gallery-page.component';
import {InvoicePageComponent} from './invoice/invoice-page.component';
import {UserProfilePageComponent} from './user-profile/user-profile-page.component';
import {SearchComponent} from './search/search.component';
import {KnowledgeBaseComponent} from './knowledge-base/knowledge-base.component';


@NgModule({
    imports: [
        CommonModule,
        FullPagesRoutingModule,
        FormsModule,
        ChartistModule,
        AgmCoreModule,
        NgbModule
    ],
    declarations: [
        GalleryPageComponent,
        InvoicePageComponent,
        UserProfilePageComponent,
        SearchComponent,
        KnowledgeBaseComponent
    ]
})
export class FullPagesModule {
}
