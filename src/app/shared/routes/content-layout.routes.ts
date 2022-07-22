import { Routes, RouterModule } from '@angular/router';


export const CONTENT_ROUTES: Routes = [
     {
        path: 'pages',
        loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule)
    }
];
