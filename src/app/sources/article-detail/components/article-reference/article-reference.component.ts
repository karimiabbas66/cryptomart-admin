import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BookModel} from '../../../shared/dto/book.model';
import {ArticleService} from '../../../shared/service/article.service';
import {ToastrService} from 'ngx-toastr';
import {ArticleModel} from '../../../shared/dto/article.model';
import {ArticleReferenceModel} from '../../../shared/dto/article-reference.model';
import {JournalModel} from '../../../shared/dto/journal.model';
import {ConferenceModel} from '../../../shared/dto/conference.model';
import {BookService} from '../../../shared/service/book.service';
import {JournalService} from '../../../shared/service/journal.service';
import {ConferenceService} from '../../../shared/service/conference.service';
import {MagazineModel} from '../../../shared/dto/magazine.model';
import {MagazineService} from '../../../shared/service/magazine.service';

@Component({
    selector: 'app-article-reference',
    templateUrl: './article-reference.component.html',
    styleUrls: ['./article-reference.component.scss']
})
export class ArticleReferenceComponent implements OnInit {

    public referencedForm: FormGroup;
    first: number = 0;
    referenceTypes: any;
    selectedReference: ArticleReferenceModel[] = [];
    showProgress: boolean = false;
    typeId: number;
    @Input() public article: ArticleModel;
    @Output() referenceEmitter: EventEmitter<any> = new EventEmitter<any>();
    bookModel: BookModel[] = [];
    journalModel: JournalModel[] = [];
    conferenceModel: ConferenceModel[] = [];
    magazineModel: MagazineModel[] = [];
    totalRecords: number;
    tableSize: number = 5;

    constructor(private articleService: ArticleService,
                private change: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private bookService: BookService,
                private journalService: JournalService,
                private conferenceService: ConferenceService,
                private magazineService: MagazineService,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.referenceTypes = [{id: 0, title: 'کتاب'}, {id: 1, title: 'نشریه علمی'}, {id: 2, title: 'مجله'},
            {id: 3, title: 'کنفرانس'}, {id: 4, title: 'کریپتومارت'}, {id: 5, title: 'روزنامه'}, {id: 6, title: 'سایر'}];

        this.referencedForm = this.formBuilder.group({
            referenceType: new FormControl('', [Validators.required]),
            reference: new FormControl('', [Validators.required]),
            referenceName: new FormControl('', [Validators.required]),
        });

        if (this.article) {
            this.articleService.getArticleReferenceByArticleId(this.article.id).then((result: ArticleReferenceModel[]) => {
                this.selectedReference = result;
            });
        }
    }

    getReferences(event: any) {
        if (event != null) {
            this.typeId = event.id;

            if (event.id === 0) {
                this.getBookList(0);
            }
            if (event.id === 1) {
                this.getJournalList(0);
            }
            if (event.id === 2) {
                this.getMagazineList(0);
            }
            if (event.id === 3) {
                this.getConferenceList(0);
            }
        }
    }

    getBookList(pageNumber) {
        this.showProgress = true;
        this.bookService.getAllBookCount().then((value: number) => {
            this.totalRecords = value;
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
        });
        const page: number = +pageNumber;
        this.bookService.getAllBook(page, this.tableSize)
            .then((result: BookModel[]) => {
                this.bookModel = result;
                this.change.detectChanges();
            }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

    getJournalList(pageNumber) {
        this.showProgress = true;
        this.journalService.getAllJournalsCount().then((count: number) => {
            this.totalRecords = count;
            this.showProgress = false;
        }).catch(error => {
            return error;
        });
        const page: number = +pageNumber;
        this.journalService.getAllJournal(page, this.tableSize).then((data: JournalModel[]) => {
            this.journalModel = data;
            if (this.journalModel.length > 0) {
                this.journalModel.forEach(journal => {
                    if (journal.releaseType) {
                        switch (journal.releaseType) {
                            case 1:
                                journal.releaseTypeName = 'الکترونیکی';
                                break;
                            case 2:
                                journal.releaseTypeName = 'چاپی';
                                break;
                            case 3:
                                journal.releaseTypeName = 'چاپی-الکترونیکی';
                        }
                    }
                });
            }
            this.change.detectChanges();
        }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.errorMessage)
        });
    }

    getMagazineList(pageNumber) {
        this.showProgress = true;
        this.magazineService.getAllMagazineCount().then((count: number) => {
            this.totalRecords = count;
            this.showProgress = false;
        }).catch(error => {
            return error;
        });
        const page: number = +pageNumber;
        this.magazineService.getAllMagazine(page, this.tableSize).then((data: MagazineModel[]) => {
            this.magazineModel = data;
            if (this.magazineModel.length > 0) {
                this.magazineModel.forEach(magazine => {
                    if (magazine.releaseType) {
                        switch (magazine.releaseType) {
                            case 1:
                                magazine.releaseTypeName = 'الکترونیکی';
                                break;
                            case 2:
                                magazine.releaseTypeName = 'چاپی';
                                break;
                            case 3:
                                magazine.releaseTypeName = 'چاپی-الکترونیکی';
                        }
                    }
                });
            }
            this.change.detectChanges();
        }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.errorMessage)
        });
    }

    getConferenceList(pageNumber) {
        this.showProgress = true;
        this.conferenceService.getConferenceCount().then((count: number) => {
            this.totalRecords = count;
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
        });
        const page: number = +pageNumber;
        this.conferenceService.getAllConference(page, this.tableSize).then((data: ConferenceModel[]) => {
            this.conferenceModel = data;
            if (this.conferenceModel.length > 0) {
                this.conferenceModel.forEach(conference => {
                    conference.conferencePlace = conference.conferenceCityPlace + '(' + conference.conferenceStatePlace + ')';
                });
            }
            this.change.detectChanges();
        }).catch(error => {
            this.toastr.error(error.error.errorMessage)
        });

    }

    findReferenceType(reference: ArticleReferenceModel): any {
        if (reference.bookId) {
            return 'کتاب';

        } else if (reference.magazineId) {
            return 'مجله';

        } else if (reference.journalId) {
            return 'نشریه علمی';

        } else if (reference.conferenceId) {
            return 'کنفرانس';

        } else if (reference.otherId) {
            return 'سایر';

        } else if (reference.newsPaperId) {
            return 'روزنامه';

        } else if (reference.scienceCityId) {
            return 'کریپتومارت';

        }
    }


    removeReference(removeReference: ArticleReferenceModel) {
        this.selectedReference.forEach((reference, index) => {
            if (removeReference.bookId) {
                if (reference.bookId === removeReference.bookId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.journalId) {
                if (reference.journalId === removeReference.journalId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.conferenceId) {
                if (reference.conferenceId === removeReference.conferenceId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.magazineId) {
                if (reference.magazineId === removeReference.magazineId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.newsPaperId) {
                if (reference.newsPaperId === removeReference.newsPaperId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.scienceCityId) {
                if (reference.scienceCityId === removeReference.scienceCityId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.otherId) {
                if (reference.otherId === removeReference.otherId) {
                    this.selectedReference.splice(index, 1);
                }
            }
        });
    }


    selectBookForReference(book: BookModel) {
        this.selectedReference.push({bookId: book.id, referenceName: book.title, referenceType: 0});
    }

    selectJournalForReference(journal: JournalModel) {
        this.selectedReference.push({journalId: journal.id, referenceName: journal.title, referenceType: 1});
    }

    selectMagazineForReference(magazine: MagazineModel) {
        this.selectedReference.push({magazineId: magazine.id, referenceName: magazine.title, referenceType: 2})
    }

    selectConferenceForReference(conference: ConferenceModel) {
        this.selectedReference.push({conferenceId: conference.id, referenceName: conference.title, referenceType: 3});
    }

    addReferenced() {
        this.referenceEmitter.emit(this.selectedReference);
    }
}
