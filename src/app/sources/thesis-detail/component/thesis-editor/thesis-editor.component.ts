import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, Scroll} from '@angular/router';
import {SourceContentModel} from '../../../shared/dto/source-content.model';
import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs-compat/Subscription';
import {ThesisService} from '../../../shared/service/thesis.service';

@Component({
    selector: 'thesis-article-editor',
    templateUrl: './thesis-editor.component.html',
    styleUrls: ['./thesis-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ThesisEditorComponent implements OnInit, OnDestroy {
    showProgress: boolean = false;
    editorModel: string;
    private BASE64_DATA_URI_PREFIX = 'data:image/png;base64,';
    bookResourceId: string;
    pageNumber: number = 1;
    sourceModel: SourceContentModel;
    editorMode: boolean = false;

    selectPageNumber: number;
    private unsubscriber: ISubscription;

    constructor(private thesisService: ThesisService,
                private elementRef: ElementRef,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.bookResourceId = params['id'];
            this.getSourceContent(1);
        });
        this.unsubscriber = this.router.events.subscribe(res => {
            if (res instanceof Scroll) {
                console.log('this.sourceModel::', res);
                if (res.anchor !== 'not-exist') {
                    this.findById(res.anchor);
                }
            }
        })

    }

    private getSourceContent(pageNumber?: number) {
        this.showProgress=true;
        this.thesisService.getThesisPageByPageNumber(this.bookResourceId, pageNumber ? pageNumber : this.pageNumber)
            .then((res: SourceContentModel) => {
                if (!res) {
                    this.toastr.error('فابل مورد نظر وجود ندارد');
                    this.router.navigate(['/sources/thesis-detail'], {queryParams: {bookId: this.bookResourceId}});
                } else {
                this.showProgress=false;
                this.sourceModel = res;
                this.selectPageNumber = res.pageNumber;
                res.fileType === 'pdf' ? this.editorModel = this.BASE64_DATA_URI_PREFIX + res.pageContent :
                    this.editorModel = res.pageContent;
                console.log('this.sourceModel::', this.sourceModel);
                }
            }).catch(error => {
            this.showProgress=false;
            this.toastr.error('خطا درعملیات دریافت پایان نامه');
        })
    }

    nextPage() {
        if (this.sourceModel && this.sourceModel.nextPage != null) {
            this.pageNumber++;
            this.getSourceContent();
        }
    }

    pereviusPage() {
        this.pageNumber--;
        this.getSourceContent();
    }

    savePage() {
        console.log('this.editorModel::', this.sourceModel);
        this.sourceModel.pageContent = this.editorModel;
        this.showProgress=true;
        this.thesisService.savePageInfo(this.sourceModel)
            .then(res => {
                this.showProgress=false;
                this.toastr.success('عملیات ذخیره با موفقیت انجام شد');
                this.sourceModel = res;
                console.log('this.sourceModel::', this.sourceModel);
            }).catch(error => {
            this.showProgress=false;
            this.toastr.error('خطا درعملیات ذخیره');
        })

    }

    findById(id: any) {
        this.showProgress=true;
        this.thesisService.getThesisPageById(id)
            .then(res => {
                this.showProgress=false;
                this.sourceModel = res;
                this.editorModel = res.pageContent;
                this.selectPageNumber = res.pageNumber;
                console.log('this.sourceModel::', this.sourceModel);
            }).catch(error => {
            this.showProgress=false;
            this.toastr.error('خطا درعملیات دریافت کتاب');
        })
    }

    selectedPageNumber() {
        this.pageNumber = this.selectPageNumber;
        this.getSourceContent(this.selectPageNumber);
        console.log('data::');
    }

    ngOnDestroy(): void {
        this.unsubscriber.unsubscribe();
    }
}
