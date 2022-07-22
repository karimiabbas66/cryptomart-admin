import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../shared/auth/auth-guard.service';
import {BannerListComponent} from './banner-list/banner-list.component';
import {BannerDetailComponent} from './banner-detail/banner-detail.component';
import {NewsListComponent} from './news-list/news-list.component';
import {NewsDetailComponent} from './news-detail/news-detail.component';
import {StaticPageListComponent} from './static-page-list/static-page-list.component';
import {StaticPageDetailComponent} from './static-page-detail/static-page-detail.component';
import {LogoDetailsComponent} from './logo-details/logo-details.component';
import {LogoListComponent} from './logo-list/logo-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'banner-list',
        component: BannerListComponent,
        data: {
          title: 'BannerList'
        }
      },
      {
        path: 'banner-detail',
        component: BannerDetailComponent,
        data: {
          title: 'BannerDetail'
        }
      },
      {
        path: 'news-list',
        component: NewsListComponent,
        data: {
          title: 'NewsList'
        }
      },
      {
        path: 'news-detail',
        component: NewsDetailComponent,
        data: {
          title: 'NewsDetail'
        }
      },
      {
        path: 'logo-list',
        component: LogoListComponent,
        data: {
          title: 'LogoList'
        }
      },
      {
        path: 'logo-details',
        component: LogoDetailsComponent,
        data: {
          title: 'LogoDetails'
        }
      },
      {
        path: 'static-page-list',
        component: StaticPageListComponent,
        data: {
          title: 'StaticPageList'
        }
      },
      {
        path: 'static-page-detail',
        component: StaticPageDetailComponent,
        data: {
          title: 'StaticPageDetail'
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule { }
