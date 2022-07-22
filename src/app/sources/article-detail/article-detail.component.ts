import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ArticleService} from '../shared/service/article.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleModel} from '../shared/dto/article.model';
import {WizardComponent} from 'angular-archwizard';
import {AuthorModel} from '../shared/dto/author.model';
import {OwnerModel} from '../shared/dto/owner.model';
import {BookModel} from '../shared/dto/book.model';

@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

    public articleId: number;
    public article: ArticleModel = {};
    showProgress: boolean = false;
    step: number = 1;
    @ViewChild(WizardComponent, {static: false})
    public wizard: WizardComponent;
    authors: AuthorModel[] = [];
    allOwners: OwnerModel[] = [];
    // referenceBook: BookModel[] = [];

    owners: OwnerModel[] = [];
    file: { fileType?: string; fileUuid?: string, fileConfirmed?: boolean } = {};

    constructor(private articleService: ArticleService,
                private toastr: ToastrService,
                private change: ChangeDetectorRef,
                private router: Router,
                private route: ActivatedRoute,) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.articleId = param['articleId'];
            if (this.articleId) {
                this.showProgress = true;
                this.articleService.getArticleModel(this.articleId).then((result: ArticleModel) => {
                    this.showProgress = false;
                    this.article = result;
                    this.file = {fileType: result.fileType, fileUuid: result.fileUuid, fileConfirmed: result.fileConfirmed};
                }).catch(error => {
                    this.showProgress = false;
                })
            }
        });
    }

    onArticleInfo(data: any) {
        this.step = 2;
        this.article = data;
        this.wizard.model.navigationMode.goToNextStep();
    }

    onAuthorInfo(data: any) {
        this.step = 3;
        this.authors = data;
        this.article.resourceAuthorDtos = data;
        this.article.confirmed = data[0].confirmed;
        this.wizard.model.navigationMode.goToNextStep();
        this.allOwners = data.map(owner => ({
            fullName: owner.fullName,
            authorId: owner.authorId,
            authorType: 0
        }));
        this.allOwners = this.allOwners.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.ownerId === thing.ownerId
            ))
        );
    }

    onOwnerInfo(data: any) {
        this.step = 4;
        this.owners = data;
        this.article.ownerConfirmed = data[0].confirmed;
        this.wizard.model.navigationMode.goToNextStep();
        this.article.ownerDtos = data;
    }

    onArticleReference(data: any) {
        this.step = 5;
        this.article.articleReferenceDtos = data;
        this.wizard.model.navigationMode.goToNextStep();
        console.log('this.article:', this.article);
    }

    onFileInfo(data: any) {
        this.article.fileUuid = data.fileUuid;
        this.article.fileType = data.fileType;
        this.article.fileConfirmed = data.fileConfirmed;
        this.articleService.saveNewArticle(this.article)
            .then(res => {
                this.toastr.success('مقاله با موفقیت ذخیره شد');
                this.router.navigate(['/sources/article-list'], {relativeTo: this.route.parent});
            }).catch(ex => {
            this.toastr.error(ex.error.message);
        })

    }


}
