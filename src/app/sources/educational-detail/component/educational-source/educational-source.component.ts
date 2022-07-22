import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EducationalContentModel} from '../../../shared/dto/educational-content.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EducationalService} from '../../../shared/service/educational.service';
import {CourseResourceModel} from '../../../shared/dto/course-resource.model';
import {ReferenceCourseModel} from '../../../shared/dto/reference-course.model';
import {BookModel} from '../../../shared/dto/book.model';
import {BookService} from '../../../shared/service/book.service';
import {ToastrService} from 'ngx-toastr';
import {ArticleModel} from '../../../shared/dto/article.model';
import {ThesisModel} from '../../../shared/dto/thesis.model';
import {ThesisService} from '../../../shared/service/thesis.service';
import {ArticleService} from '../../../shared/service/article.service';
import {ArticleReferenceModel} from '../../../shared/dto/article-reference.model';
import {LessonPlanModel} from '../../../shared/dto/lesson-plan.model';

@Component({
    selector: 'app-educational-source',
    templateUrl: './educational-source.component.html',
    styleUrls: ['./educational-source.component.scss']
})
export class EducationalSourceComponent implements OnInit {

    @Input() model: EducationalContentModel;
    @Output() educationalEmitter: EventEmitter<any> = new EventEmitter<any>();
    selectedReference: ReferenceCourseModel[] = []
    sourceForm: FormGroup;
    multiSource: boolean;
    showProgress: boolean;
    referenceTypes: any;
    typeId: number;
    bookModel: BookModel[] = [];
    articleModel: ArticleModel[] = [];
    thesisModel: ThesisModel[] = [];
    educationalModel: EducationalContentModel[] = [];
    totalRecords: number;
    tableSize: number = 5;


    constructor(private formBuilder: FormBuilder,
                private bookService: BookService,
                private change: ChangeDetectorRef,
                private toastr: ToastrService,
                private thesisService: ThesisService,
                private articleService: ArticleService,
                private educationalService: EducationalService) {
    }

    ngOnInit() {
        if (this.model.educationalType == 'COURSE_RESOURCE') {
            this.multiSource = false;
        }
        this.showProgress = true;
        this.referenceTypes = [{id: 0, title: 'کتاب'}, {id: 1, title: 'پایان نامه'}, {id: 2, title: 'مقاله'},
            {id: 3, title: 'محتوای آموزشی'}, {id: 4, title: 'سایر'}];

        this.sourceForm = this.formBuilder.group({
            referenceType: new FormControl('', [Validators.required]),
            reference: new FormControl('', [Validators.required]),
            referenceName: new FormControl('', [Validators.required]),
        });
        console.log(this.model)
        if (this.model.id) {
            this.showProgress = true;
            if (this.model.educationalType == 'COURSE_RESOURCE') {
                this.educationalService.getReferenceByResource(this.model.courseResourceDto.id).then((result: ReferenceCourseModel) => {
                    if (result.id) {
                        this.selectedReference.push(result);
                    }
                }).catch(error => {
                    return error;
                });
            } else {
                this.educationalService.getReferenceByLesson(this.model.lessonPlanDto.id).then((result: ReferenceCourseModel[]) => {
                    this.selectedReference = result;
                }).catch(error => {
                    return error;
                });
            }
            this.showProgress = false;
        }

    }

    getReferencesType(event: any) {
        if (event != null) {
            this.typeId = event.id;

            if (event.id === 0) {
                this.getBookList(0);
            }
            if (event.id === 1) {
                this.getThesisList(0);
            }
            if (event.id === 2) {
                this.getArticleList(0);
            }
            if (event.id === 3) {
                this.getEducationalList(0);
            }
            // if (event.id === 4) {
            //     this.getOtherList(0);
            // }
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
        });
    }

    getThesisList(pageNumber) {
        this.showProgress = true;
        const page: number = +pageNumber;
        this.thesisService.getAllThesis(page, this.tableSize).then((result: ThesisModel[]) => {
            this.showProgress = false;
            this.thesisModel = result;
            if (this.thesisModel) {
                this.thesisModel.forEach(thesis => {
                    switch (thesis.levelId) {
                        case 1:
                            thesis.levelTitle = 'کارشناسی';
                            break;
                        case 2:
                            thesis.levelTitle = 'کارشناسی ارشد';
                            break;
                        case 3:
                            thesis.levelTitle = 'دکتري حرفه اي';
                            break;
                        case 4:
                            thesis.levelTitle = 'phd دکتري تحصصی';
                            break;
                        case 5:
                            thesis.levelTitle = 'سطح 3 حوزه علمیه';
                            break;
                        case 6:
                            thesis.levelTitle = 'سطح 4 حوزه علمیه';
                            break;
                    }
                });
            }
            this.change.detectChanges();

        }).catch(error => {
            this.toastr.error(error.error.errorMessage)
        });

    }

    getArticleList(pageNumber) {
        this.showProgress = true;
        const page: number = +pageNumber;
        this.articleService.getAllArticle(page, this.tableSize)
            .then((res: ArticleModel[]) => {
                this.showProgress = false;
                this.articleModel = res;
                this.change.detectChanges();
            }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.message);
        });
    }

    getEducationalList(pageNumber) {
        this.showProgress = true;
        const page: number = +pageNumber;
        this.educationalService.getAll(page, this.tableSize).then((result: EducationalContentModel[]) => {
            this.showProgress = false;
            this.educationalModel = result;
            if (this.educationalModel) {
                this.educationalModel.forEach(educational => {
                    switch (educational.educationalType) {
                        case 'COURSE_RESOURCE':
                            educational.creator = educational.courseResourceDto.creator;
                            educational.lecture = educational.courseResourceDto.lecture;
                            educational.topic = educational.courseResourceDto.topic;
                            educational.page = educational.courseResourceDto.pages;
                            break;
                        case 'LESSON_PLAN':
                            educational.creator = educational.lessonPlanDto.producer;
                            educational.lecture = educational.lessonPlanDto.lecture;
                            educational.topic = educational.lessonPlanDto.topic;
                            educational.page = educational.lessonPlanDto.pages;
                            break;
                    }
                });
            }
            this.change.detectChanges();
        }).catch(error => {
            this.toastr.error(error.error.errorMessage);
        });
    }

    selectedChoiceType(reference: ReferenceCourseModel): any {
        if (reference.bookId) {
            return 'کتاب';

        } else if (reference.educationalId) {
            return 'محتوای آموزشی';

        } else if (reference.thesisId) {
            return 'پایان نامه';

        } else if (reference.articleId) {
            return 'مقاله';

        } else if (reference.otherId) {
            return 'سایر';
        }
    }

    removeSelectedReference(removeReference: ReferenceCourseModel) {
        this.selectedReference.forEach((reference, index) => {
            if (removeReference.bookId) {
                if (reference.bookId === removeReference.bookId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.thesisId) {
                if (reference.thesisId === removeReference.thesisId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.articleId) {
                if (reference.articleId === removeReference.articleId) {
                    this.selectedReference.splice(index, 1);
                }
            }
            if (removeReference.educationalId) {
                if (reference.educationalId === removeReference.educationalId) {
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
        if (this.multiSource == false && this.selectedReference.length >= 1) {
            this.toastr.warning('برای جزوه یا تقریر فقط یک منبع انتخاب کنید')
        } else {
            this.selectedReference.push({bookId: book.id, referenceName: book.title, referenceType: 0});
        }
    }

    selectThesisForReference(thesis: ThesisModel) {
        if (this.multiSource == false && this.selectedReference.length >= 1) {
            this.toastr.warning('برای جزوه یا تقریر فقط یک منبع انتخاب کنید')
        } else {
            this.selectedReference.push({thesisId: thesis.id, referenceName: thesis.persianTitle, referenceType: 1});
        }
    }

    selectArticleForReference(article: ArticleModel) {
        if (this.multiSource == false && this.selectedReference.length >= 1) {
            this.toastr.warning('برای جزوه یا تقریر فقط یک منبع انتخاب کنید')
        } else {
            this.selectedReference.push({articleId: article.id, referenceName: article.title, referenceType: 2});
        }
    }

    selectEducationalForReference(educational: EducationalContentModel) {
        if (this.multiSource == false && this.selectedReference.length >= 1) {
            this.toastr.warning('برای جزوه یا تقریر فقط یک منبع انتخاب کنید')
        } else {
            this.selectedReference.push({educationalId: educational.id, referenceName:educational.creator, referenceType: 3});
        }
    }

    addReference() {
        this.educationalEmitter.emit(this.selectedReference);
    }

    // selectOtherForReference(other: otherModel) {
    //     this.selectedReference.push({bookId: book.id, referenceName: book.title, referenceType: 4});
    // }

}
