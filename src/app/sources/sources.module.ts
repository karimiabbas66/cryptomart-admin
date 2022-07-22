import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorListComponent} from './author-list/author-list.component';
import {SourcesRoutingModule} from './sources-routing.module';
import {ChartistModule} from 'ng-chartist';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatchHeightModule} from '../shared/directives/match-height.directive';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {InputTextModule} from 'primeng/inputtext';
import {AuthorDetailComponent} from './author-detail/author-detail.component';
import {PublisherListComponent} from './publisher-list/publisher-list.component';
import {PublisherDetailComponent} from './publisher-detail/publisher-detail.component';
import {OwnerListComponent} from './owner-list/owner-list.component';
import {OwnerDetailComponent} from './owner-detail/owner-detail.component';
import {BookListComponent} from './book-list/book-list.component';
import {BookDetailComponent} from './book-detail/book-detail.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ArchwizardModule} from 'angular-archwizard';
import {BookAuthorComponent} from './book-detail/components/book-author/book-author.component';
import {BookInfoComponent} from './book-detail/components/book-info/book-info.component';
import {BookPublisherComponent} from './book-detail/components/book-publisher/book-publisher.component';
import {BookOwnerComponent} from './book-detail/components/book-owner/book-owner.component';
import {BookFileComponent} from './book-detail/components/book-file/book-file.component';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {CustomFormsModule} from 'ng2-validation';
import {SharedModule} from '../shared/shared.module';
import {OrganizationManagementModule} from '../organization-management/organization-management.module';
import {BookEditorComponent} from './book-detail/components/book-editor/book-editor.component';
import {EditorModule} from '@tinymce/tinymce-angular';
import {ArticleListComponent} from './article-list/article-list.component';
import {ArticleDetailComponent} from './article-detail/article-detail.component';
import {ArticleInfoComponent} from './article-detail/components/article-info/article-info.component';
import {ArticleAuthorComponent} from './article-detail/components/article-author/article-author.component';
import {ArticleEditorComponent} from './article-detail/components/article-editor/article-editor.component';
import {ArticleFileComponent} from './article-detail/components/article-file/article-file.component';
import {ArticleOwnerComponent} from './article-detail/components/article-owner/article-owner.component';
import {ArticleReferenceComponent} from './article-detail/components/article-reference/article-reference.component';
import {JournalListComponent} from './journal-list/journal-list.component';
import {JournalDetailComponent} from './journal-detail/journal-detail.component';
import {JournalInfoComponent} from './journal-detail/component/journal-info/journal-info.component';
import {JournalScoreComponent} from './journal-detail/component/journal-score/journal-score.component';
import {JournalOwnerComponent} from './journal-detail/component/journal-owner/journal-owner.component';
import {JournalInvolvedComponent} from './journal-detail/component/journal-involved/journal-involved.component';
import {JournalNumberListComponent} from './journal-list/component/journal-number-list/journal-number-list.component';
import {JournalNumberDetailComponent} from './journal-list/component/journal-number-detail/journal-number-detail.component';
import {ThesisListComponent} from './thesis-list/thesis-list.component';
import {ThesisDetailComponent} from './thesis-detail/thesis-detail.component';
import {ThesisInfoComponent} from './thesis-detail/component/thesis-info/thesis-info.component';
import {ThesisInvolvedComponent} from './thesis-detail/component/thesis-involved/thesis-involved.component';
import {ThesisUniversityComponent} from './thesis-detail/component/thesis-university/thesis-university.component';
import {ConferenceListComponent} from './conference-list/conference-list.component';
import {ConferenceDetailComponent} from './conference-detail/conference-detail.component';
import {InvolvedDetailComponent} from './involved-detail/involved-detail.component';
import {MagazineListComponent} from './magazine-list/magazine-list.component';
import {MagazineDetailComponent} from './magazine-detail/magazine-detail.component';
import {MagazineNumberDetailComponent} from './magazine-list/component/magazine-number-detail/magazine-number-detail.component';
import {MagazineNumberListComponent} from './magazine-list/component/magazine-number-list/magazine-number-list.component';
import {MagazineInfoComponent} from './magazine-detail/component/magazine-info/magazine-info.component';
import {MagazineInvolvedComponent} from './magazine-detail/component/magazine-involved/magazine-involved.component';
import {MagazineOwnerComponent} from './magazine-detail/component/magazine-owner/magazine-owner.component';
import { EducationalListComponent } from './educational-list/educational-list.component';
import { EducationalDetailComponent } from './educational-detail/educational-detail.component';
import { EducationalInfoComponent } from './educational-detail/component/educational-info/educational-info.component';
import { EducationalSourceComponent } from './educational-detail/component/educational-source/educational-source.component';
import { SheetReportListComponent } from './sheet-report-list/sheet-report-list.component';
import { SheetReportDetailComponent } from './sheet-report-detail/sheet-report-detail.component';
import { ResearchSheetDetailComponent } from './research-sheet-detail/research-sheet-detail.component';
import { ThesisFileComponent } from './thesis-detail/component/thesis-file/thesis-file.component';
import {ThesisEditorComponent} from './thesis-detail/component/thesis-editor/thesis-editor.component';

@NgModule({
  declarations: [AuthorListComponent,
    AuthorDetailComponent,
    PublisherListComponent,
    PublisherDetailComponent,
    OwnerListComponent,
    OwnerDetailComponent,
    BookListComponent,
    BookDetailComponent,
    BookAuthorComponent,
    BookInfoComponent,
    BookPublisherComponent,
    BookOwnerComponent,
    BookFileComponent,
    BookEditorComponent,
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleInfoComponent,
    ArticleAuthorComponent,
      ArticleEditorComponent,
      ArticleFileComponent,
      ArticleOwnerComponent,
      ArticleReferenceComponent,
      JournalListComponent,
      JournalDetailComponent,
      JournalInfoComponent,
      JournalScoreComponent,
      JournalOwnerComponent,
      JournalInvolvedComponent,
      JournalNumberListComponent,
      JournalNumberDetailComponent,
      ThesisListComponent,
      ThesisDetailComponent,
      ThesisInfoComponent,
      ThesisInvolvedComponent,
      ThesisUniversityComponent,
      JournalNumberDetailComponent,
      ConferenceListComponent,
      ConferenceDetailComponent,
      InvolvedDetailComponent,
      MagazineListComponent,
      MagazineDetailComponent,
      MagazineNumberDetailComponent,
      MagazineNumberListComponent,
      MagazineInfoComponent,
      MagazineInvolvedComponent,
      MagazineOwnerComponent,
      EducationalListComponent,
      EducationalDetailComponent,
      EducationalInfoComponent,
      EducationalSourceComponent,
      SheetReportListComponent,
      SheetReportDetailComponent,
      ResearchSheetDetailComponent,
      ThesisFileComponent,
      ThesisEditorComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    SourcesRoutingModule,
    ChartistModule,
    NgbModule,
    MatchHeightModule,
    TableModule,
    ReactiveFormsModule,
    TagInputModule,
    FormsModule,
    ArchwizardModule,
    NgSelectModule,
    FileUploadModule,
    DpDatePickerModule,
    CustomFormsModule,
    OrganizationManagementModule,
    EditorModule,
    SharedModule
  ]
})
export class SourcesModule { }
