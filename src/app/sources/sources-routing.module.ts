import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorListComponent} from './author-list/author-list.component';
import {AuthorDetailComponent} from './author-detail/author-detail.component';
import {PublisherListComponent} from './publisher-list/publisher-list.component';
import {PublisherDetailComponent} from './publisher-detail/publisher-detail.component';
import {OwnerListComponent} from './owner-list/owner-list.component';
import {OwnerDetailComponent} from './owner-detail/owner-detail.component';
import {BookListComponent} from './book-list/book-list.component';
import {BookDetailComponent} from './book-detail/book-detail.component';
import {BookEditorComponent} from './book-detail/components/book-editor/book-editor.component';
import {ArticleListComponent} from './article-list/article-list.component';
import {ArticleDetailComponent} from './article-detail/article-detail.component';
import {ArticleEditorComponent} from './article-detail/components/article-editor/article-editor.component';
import {ArticleFileComponent} from './article-detail/components/article-file/article-file.component';
import {ArticleOwnerComponent} from './article-detail/components/article-owner/article-owner.component';
import {JournalListComponent} from './journal-list/journal-list.component';
import {JournalDetailComponent} from './journal-detail/journal-detail.component';
import {JournalNumberListComponent} from './journal-list/component/journal-number-list/journal-number-list.component';
import {JournalNumberDetailComponent} from './journal-list/component/journal-number-detail/journal-number-detail.component';
import {ThesisListComponent} from './thesis-list/thesis-list.component';
import {ThesisDetailComponent} from './thesis-detail/thesis-detail.component';
import {ConferenceListComponent} from './conference-list/conference-list.component';
import {ConferenceDetailComponent} from './conference-detail/conference-detail.component';
import {MagazineDetailComponent} from './magazine-detail/magazine-detail.component';
import {MagazineListComponent} from './magazine-list/magazine-list.component';
import {MagazineNumberListComponent} from './magazine-list/component/magazine-number-list/magazine-number-list.component';
import {MagazineNumberDetailComponent} from './magazine-list/component/magazine-number-detail/magazine-number-detail.component';
import { EducationalDetailComponent } from './educational-detail/educational-detail.component';
import { EducationalListComponent } from './educational-list/educational-list.component';
import {SheetReportListComponent} from './sheet-report-list/sheet-report-list.component';
import {SheetReportDetailComponent} from './sheet-report-detail/sheet-report-detail.component';
import {ResearchSheetDetailComponent} from './research-sheet-detail/research-sheet-detail.component';
import {ThesisEditorComponent} from './thesis-detail/component/thesis-editor/thesis-editor.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'author-list',
        component: AuthorListComponent,
        data: {
          title: 'AuthorList'
        }
      },
      {
        path: 'author-detail',
        component: AuthorDetailComponent,
        data: {
          title: 'AuthorDetail'
        }
      },
      {
        path: 'publisher-list',
        component: PublisherListComponent,
        data: {
          title: 'PublisherList'
        }
      },
      {
        path: 'publisher-detail',
        component: PublisherDetailComponent,
        data: {
          title: 'PublisherDetail'
        }
      },
      {
        path: 'owner-list',
        component: OwnerListComponent,
        data: {
          title: 'OwnerList'
        }
      },
      {
        path: 'owner-detail',
        component: OwnerDetailComponent,
        data: {
          title: 'OwnerDetail'
        }
      },
      {
        path: 'book-list',
        component: BookListComponent,
        data: {
          title: 'BookList'
        }
      },
      {
        path: 'book-detail',
        component: BookDetailComponent,
        data: {
          title: 'BookDetail'
        }
      },
      {
        path: 'book-editor',
        component: BookEditorComponent,
        data: {
          title: 'BookEditor'
        }
      },
      {
        path: 'article-list',
        component: ArticleListComponent,
        data: {
          title: 'ArticleList'
        }
      },
      {
        path: 'article-detail',
        component: ArticleDetailComponent,
        data: {
          title: 'articleDetail'
        }
      },
      {
        path: 'article-owner',
        component: ArticleOwnerComponent,
        data: {
          title: 'BookOwner'
        }
      },
      {
        path: 'book-file',
        component: ArticleFileComponent,
        data: {
          title: 'ArticleFile'
        }
      },
      {
        path: 'article-editor',
        component: ArticleEditorComponent,
        data: {
          title: 'ArticleEditor'
        }
      },
      {
        path: 'journal-list',
        component: JournalListComponent,
        data: {
          title: 'JournalList'
        }
      },
      {
        path: 'journal-detail',
        component: JournalDetailComponent,
        data: {
          title: 'JournalDetail'
        }
      },
      {
        path: 'journal-number-list',
        component: JournalNumberListComponent,
        data: {
          title: 'JournalNumberList'
        }
      },
      {
        path: 'journal-number-detail',
        component: JournalNumberDetailComponent,
        data: {
          title: 'JournalNumberDetail'
        }
      },
      {
        path: 'thesis-list',
        component: ThesisListComponent,
        data: {
          title: 'ThesisList'
        }
      },
      {
        path: 'thesis-detail',
        component: ThesisDetailComponent,
        data: {
          title: 'ThesisDetail'
        }
      },
      {
        path: 'thesis-editor',
        component: ThesisEditorComponent,
        data: {
          title: 'ThesisEditor'
        }
      },
      {
        path: 'conference-list',
        component: ConferenceListComponent,
        data: {
          title: 'ConferenceList'
        }
      },
      {
        path: 'conference-detail',
        component: ConferenceDetailComponent,
        data: {
          title: 'ConferenceDetail'
        }
      },
      {
        path: 'magazine-list',
        component: MagazineListComponent,
        data: {
          title: 'MagazineList'
        }
      },
      {
        path: 'magazine-detail',
        component: MagazineDetailComponent,
        data: {
          title: 'MagazineDetail'
        }
      },
      {
        path: 'magazine-number-list',
        component: MagazineNumberListComponent,
        data: {
          title: 'MagazineNumberList'
        }
      },
      {
        path: 'magazine-number-detail',
        component: MagazineNumberDetailComponent,
        data: {
          title: 'MagazineNumberDetail'
        }
      },
      {
        path: 'educational-list',
        component: EducationalListComponent,
        data: {
          title: 'EducationalList'
        }
      },
      {
        path: 'educational-detail',
        component: EducationalDetailComponent,
        data: {
          title: 'EducationalDetail'
        }
      },
      {
        path: 'sheet-report-list',
        component: SheetReportListComponent,
        data: {
          title: 'SheetReportList'
        }
      },
      {
        path: 'sheet-report-detail',
        component: SheetReportDetailComponent,
        data: {
          title: 'SheetReportList'
        }
      },
      {
        path: 'research-sheet-detail',
        component: ResearchSheetDetailComponent,
        data: {
          title: 'ResearchSheetDetail'
        }
      }

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcesRoutingModule { }
