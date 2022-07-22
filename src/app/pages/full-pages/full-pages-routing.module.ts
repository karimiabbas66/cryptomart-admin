import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GalleryPageComponent} from './gallery/gallery-page.component';
import {InvoicePageComponent} from './invoice/invoice-page.component';
import {UserProfilePageComponent} from './user-profile/user-profile-page.component';
import {SearchComponent} from './search/search.component';
import {KnowledgeBaseComponent} from './knowledge-base/knowledge-base.component';

const routes: Routes = [
    {
        path: '',
        children: [

            {
                path: 'gallery',
                component: GalleryPageComponent,
                data: {
                    title: 'Gallery Page'
                }
            },
            {
                path: 'invoice',
                component: InvoicePageComponent,
                data: {
                    title: 'Invoice Page'
                }
            },
            {
                path: 'profile',
                component: UserProfilePageComponent,
                data: {
                    title: 'User UserProfile Page'
                }
            },
            {
                path: 'search',
                component: SearchComponent,
                data: {
                    title: 'Search'
                }
            },
            {
                path: 'kb',
                component: KnowledgeBaseComponent,
                data: {
                    title: 'Knowledge Base'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FullPagesRoutingModule {
}
