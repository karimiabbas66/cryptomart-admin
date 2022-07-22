import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorModel} from '../../../shared/dto/author.model';
import {AuthorTypeModel} from '../../../shared/dto/author-type.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthorService} from '../../../shared/service/author.service';
import {PublisherService} from '../../../shared/service/publisher.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {ISubscription} from 'rxjs-compat/Subscription';
import {BookModel} from '../../../shared/dto/book.model';

@Component({
    selector: 'app-book-author',
    templateUrl: './book-author.component.html',
    styleUrls: ['./book-author.component.scss']
})
export class BookAuthorComponent implements OnInit, OnDestroy {

    public authorForm: FormGroup;

    showProgress: boolean = false;
    authorsCount: number;
    numberOfItemsFromEndBeforeFetchingMore = 2;
    selectedAuthor: AuthorModel[];
    authors: AuthorModel[] = [];
    loading: boolean = false;
    authorsLen: number = 0;
    authorTypes: AuthorTypeModel[];
    test: any;
    @Output()
    authorInfoEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Input() public book: BookModel;
    private _unSubscription: ISubscription;
    searchTerm: string;
    private ngbModalRef: NgbModalRef;
    confirmed: boolean;

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private authorService: AuthorService,
                private route: ActivatedRoute,
                private publisherService: PublisherService,
                private toastr: ToastrService,
                private change: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.showProgress=true;
        this.authorService.getAllAuthorCount().then((value: number) => {
            this.authorsCount = value;
            this.showProgress=false;
        }).catch(error => {
            this.showProgress=false;
        });
        this.searchAuthor(null);
        this.getAuthorType();
        this.authorForm = this.formBuilder.group({
            authors: this.formBuilder.array([this.createAuthorFormGroup()])
        });

        if (this.book != null) {
            this.showProgress=true;
            this.authorService.getAllByBookId(this.book.id).then((res: AuthorModel[]) => {
                this.selectedAuthor = res;
                this.confirmed = res[0].authorConfirmed;
                this.selectedAuthor = res.map((i) => {
                    i.fullName = !i.profileId ? i.firstName + ' ' + i.lastName : i.firstName + ' ' + i.lastName + ' (کاربر کریپتومارت)';
                    return i;
                });
                const formArray = this.authorForm.get('authors') as FormArray;
                this.showProgress=false;
                for (let v of this.selectedAuthor) {
                    console.log("this.selectedAuthor11::", this.selectedAuthor);
                    let author: AuthorModel = {
                        fullName: v.fullName, lastName: v.lastName, firstName: v.firstName,
                        authorId: v.authorId, authorTypeId: v.authorTypeId, authorTypeName: v.authorTypeName
                    };
                    let authorType: AuthorTypeModel = {id: v.authorTypeId, title: v.authorTypeName};
                    formArray.push(this.createEditAuthorFormGroup(author, authorType));
                }
                this.removeOrClearForm(0);
            }).catch(error=> {
                this.showProgress=false;
            })
        }
    }

    get formData(): FormArray {
        return this.authorForm.get('authors') as FormArray;
    }

    private createAuthorFormGroup(): FormGroup {
        const formGroup = new FormGroup({
            author: new FormControl('', [Validators.required]),
            authorType: new FormControl('', [Validators.required]),
        });
        formGroup.reset();
        return formGroup;
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

    public addFormGroup() {
        const formArray = this.authorForm.get('authors') as FormArray;
        formArray.push(this.createAuthorFormGroup())
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
        this.authorService.getAllAuthorType(0, 10).then(res => {
            this.authorTypes = res;
        })
    }

    onScrollToEnd() {
        this.searchAuthor(null);
    }

    onScroll({end}) {
        if (this.loading || this.authors.length <= this.authorsCount) {
            return;
        }

        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.authorsCount) {
            this.searchAuthor(null);
        }
    }

    searchAuthor(event) {
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
                    // i.fullName = i.firstName + ' ' + i.lastName;
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
            this.selectedAuthor.push({authorId: v.author.authorId, authorTypeId: v.authorType.id,
                                      fullName: v.author.fullName, confirmed: this.confirmed})
        }
        this.authorInfoEmitter.emit(this.selectedAuthor)
    }

    openModal(accessPage) {
        this.ngbModalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.ngbModalRef.result.then((receivedEntry) => {
            console.log("amad inja")
            this.ngbModalRef.close();
        }, (reason) => {
            this.ngbModalRef.close();
        })
    }

    getNewAuthor(receivedEntry) {
        receivedEntry.fullName = receivedEntry.firstName + ' ' + receivedEntry.lastName;
        this.authors = this.authors.concat(receivedEntry);
        this.ngbModalRef.close();
    }

    ngOnDestroy(): void {
        if (this._unSubscription) {
            this._unSubscription.unsubscribe();
        }
    }
}

