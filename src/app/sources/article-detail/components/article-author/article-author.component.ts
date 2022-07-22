import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthorModel} from '../../../shared/dto/author.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorTypeModel} from '../../../shared/dto/author-type.model';
import {AuthorService} from '../../../shared/service/author.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ArticleModel} from '../../../shared/dto/article.model';

@Component({
    selector: 'app-article-author',
    templateUrl: './article-author.component.html',
    styleUrls: ['./article-author.component.scss']
})
export class ArticleAuthorComponent implements OnInit {

    showProgress: boolean = false;
    @Input() article: ArticleModel;
    authors: AuthorModel[] = [];
    private ngbModalRef: NgbModalRef;
    public authorForm: FormGroup;
    numberOfItemsFromEndBeforeFetchingMore = 2;
    loading: boolean = false;
    authorsCount: number;
    authorTypes: AuthorTypeModel[];
    confirmed: boolean;
    selectedAuthor: AuthorModel[];
    authorsLen: number = 0;
    searchTerm: string;
    @Output()
    authorInfoEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private authorService: AuthorService,
                private route: ActivatedRoute,
                private change: ChangeDetectorRef,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.authorService.getAllAuthorCount().then((value: number) => {
            this.authorsCount = value;
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
        });
        this.searchAuthor(null);
        this.getAuthorType();
        this.authorForm = this.formBuilder.group({
            authors: this.formBuilder.array([this.createAuthorFormGroup()])
        });
        if (this.article != null) {
            this.showProgress = true;
            this.authorService.getAllAuthorByArticle(this.article.id).then((result: AuthorModel[]) => {
                this.selectedAuthor = result;
                this.confirmed = result[0].authorConfirmed;
                this.selectedAuthor = result.map((i) => {
                    i.fullName = !i.profileId ? i.firstName + ' ' + i.lastName : i.firstName + ' ' + i.lastName + ' (کاربر کریپتومارت)';
                    return i;
                });
                const formArray = this.authorForm.get('authors') as FormArray;
                this.showProgress = false;
                for (let v of this.selectedAuthor) {
                    console.log('this.selectedAuthor11::', this.selectedAuthor);
                    let author: AuthorModel = {
                        fullName: v.fullName, lastName: v.lastName, firstName: v.firstName,
                        authorId: v.authorId, authorTypeId: v.authorTypeId, authorTypeName: v.authorTypeName
                    };
                    let authorType: AuthorTypeModel = {id: v.authorTypeId, title: v.authorTypeName};
                    formArray.push(this.createEditAuthorFormGroup(author, authorType));
                }
                this.removeOrClearForm(0);
            }).catch(error => {
                this.showProgress = false;
            })
        }
    }

    private createEditAuthorFormGroup(author: AuthorModel, authorType: AuthorTypeModel): FormGroup {
        const formGroup = new FormGroup({
            author: new FormControl('', [Validators.required]),
            authorType: new FormControl('', [Validators.required]),
        });
        let formValue = {author: author, authorType: authorType};
        formGroup.get('authors');
        formGroup.patchValue(formValue);
        return formGroup;
    }

    getNewAuthor(receivedEntry) {
        receivedEntry.fullName = receivedEntry.firstName + ' ' + receivedEntry.lastName;
        this.authors = this.authors.concat(receivedEntry);
        this.ngbModalRef.close();
    }

    addFormGroup() {
        const formArray = this.authorForm.get('authors') as FormArray;
        formArray.push(this.createAuthorFormGroup());
    }

    private createAuthorFormGroup(): FormGroup {
        const formGroup = new FormGroup({
            author: new FormControl('', [Validators.required]),
            authorType: new FormControl('', [Validators.required]),
        });
        formGroup.reset();
        return formGroup;
    }

    openModal(accessPage) {
        this.ngbModalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.ngbModalRef.result.then((receivedEntry) => {
            this.ngbModalRef.close();
        }, (reason) => {
            this.ngbModalRef.close();
        })
    }

    get formData(): FormArray {
        return this.authorForm.get('authors') as FormArray;
    }

    public removeOrClearForm(i: number) {
        const formArray = this.authorForm.get('authors') as FormArray;
        if (formArray.length > 1) {
            formArray.removeAt(i)
        } else {
            formArray.reset()
        }

    }

    private getAuthorType() {
        this.authorService.getAllAuthorType(0, 10).then(result => {
            this.authorTypes = result;
        })
    }

    onScroll({end}) {
        if (this.loading || this.authors.length <= this.authorsCount) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.authorsCount) {
            this.searchAuthor(null);
        }
    }

    onScrollToEnd() {
        this.searchAuthor(null);
    }

    private searchAuthor(event) {
        if (event == null && this.authorsLen * 10 >= this.authorsCount) {
            return;
        }
        if (event != null) {
            this.searchTerm = event.term;
            this.authorsLen = 0;
        }
        this.authorService.getAllAuthor(this.authorsLen, 10, this.searchTerm != null ? this.searchTerm : null)
            .then((res: AuthorModel[]) => {
                let aut = res.map((i) => {
                    i.fullName = !i.profileId ? i.firstName + ' ' + i.lastName : i.firstName + ' ' + i.lastName + ' (کاربر کریپتومارت)';
                    return i;
                });
                if (event == null) {
                    this.authors = this.authors.concat(aut);
                } else {
                    this.authors = aut;
                }
                this.change.detectChanges();
                this.authorsLen += 1;
            }).catch(error => {
            this.toastr.error(error.error.message);
        })

    }

    addAuthors() {
        this.selectedAuthor = [];
        const formArray = this.authorForm.get('authors') as FormArray;
        for (let v of formArray.getRawValue()) {
            this.selectedAuthor.push({
                authorId: v.author.authorId, authorTypeId: v.authorType.id,
                fullName: v.author.fullName, confirmed: this.confirmed
            })
        }
        this.authorInfoEmitter.emit(this.selectedAuthor)
    }

}
