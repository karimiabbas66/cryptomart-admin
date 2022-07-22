import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Field} from '../field/Field';
import {FieldMeta} from './model/FieldMeta';
import {FieldMetaService} from './fieldMetaService';
import {PathsDto} from './model/PathsDto';
import {ModalDismissReasons, NgbModal, NgbPagination, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ChildDto} from './model/ChildDto';
import {FieldService} from '../field/FieldService';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {FieldType} from './model/FieldType';
import {Subscription} from 'rxjs';
import {DeleteRelationship} from './model/DeleteRelationship';

@Component({
    selector: 'app-field-meta',
    templateUrl: './field-meta.component.html',
    styleUrls: ['./field-meta.component.scss']
})
export class FieldMetaComponent implements OnInit, OnDestroy {

    @ViewChild('ngbPaginationParent', {static: false}) public ngbPaginationParent: NgbPagination;
    @ViewChild('ngbPaginationChild', {static: false}) public ngbPaginationChild: NgbPagination;
    @ViewChild('tabset', {static: false}) public tabSet: NgbTabset;
    id: number;
    error: string;
    fieldMetaForm: FormGroup;
    field: Field = {};
    fieldMeta: FieldMeta = {};
    distance: number;
    tagsName: string[] = [];
    childsPath: PathsDto[] = [];
    closeResult: string;
    parentsPath: PathsDto[] = [];
    selectedFieldId: number;
    fields: FieldMeta[] = [];
    childDto: ChildDto = {};
    parentChildDto: ChildDto = {};
    selectedValue = '1';
    fieldsSize: number = 0;
    parentSize: number = 0;
    selectedField: FieldMeta = new FieldMeta();
    childRow: number = 0;
    parentRow: number = 0;
    childSize: number = 0;
    searchInput: string = '';
    searching;
    loading: boolean = false;
    fieldMetaLen: number = 0;
    keywords: any = [];
    fieldTypes: FieldType[];
    filterName = '';
    numberOfItemsFromEndBeforeFetchingMore = 10;
    newField: Field = new Field();
    newFieldForm: FormGroup;
    hasAccess = true;
    secondRelationNames: string[] = [];
    secondSelectedRelationName = 'مبانی';
    firstRelationNames: string[] = [];
    firstSelectedRelationName = 'مبانی';
    selectedHistoryId: any;
    showInf = false;
    selectedFieldMeta: FieldMeta = {};
    addChild = true;
    placeHolder = 'فرزند جدید';
    deleteRelationship:DeleteRelationship={};

    subs = new Subscription();
    constructor(private route: ActivatedRoute,
                private router: Router,
                private fieldMetaService: FieldMetaService,
                private fieldService: FieldService,
                private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private toastr: ToastrService,
                private change: ChangeDetectorRef) {
    }


    ngOnInit() {
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.id = params['id'];
            this.loadData();
        }));
        this.secondRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
        this.firstRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
        this.fieldTypes = [{name: 'علمی', value: 1}, {name: 'پژوهشی', value: 2}];
        this.newFieldForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            keyword: new FormControl(''),
            type: new FormControl('', [Validators.required]),
            description: new FormControl('',),
            describe: new FormControl('',),
            relType: new FormControl('', [Validators.required])

        });
        this.fieldMetaForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required]),
            keywords: '',
            fieldType: new FormControl('', [Validators.required]),
            description: new FormControl('',),
            describe: new FormControl('',),
        });
    }

    onAddTag(event) {
        this.fieldMeta.keywords.push(event.value);
    }

    onRemoveTag(event) {
        var idx = this.fieldMeta.keywords.indexOf(event.value);
        this.fieldMeta.keywords.splice(idx, 1);
    }

    edit() {
        this.fieldMetaService.editKeywordsAndTitle(this.fieldMeta).then(value => {
            this.toastr.success('نمایه مورد نظر ویرایش شد');
            this.router.navigate(['field'], {relativeTo: this.route.parent});
        }).catch(reason => {
            this.toastr.error(reason.error.message);
        });
    }

    tabChange(event) {
        if (event.nextId == 'fieldStructured') {
            this.fieldMetaService.getChilds(this.id, 0, 5).then((value: PathsDto[]) => {
                this.childsPath = value;
            });
            this.fieldMetaService.getParents(this.id, 0, 5).then((value: PathsDto[]) => {
                this.parentsPath = value;
            });
            this.fieldMetaService.countParents(this.id).then((value: number) => {
                this.parentSize = value;
            });

            this.fieldMetaService.countChild(this.id).then((value: number) => {
                this.childSize = value;
            });
        }
    }

    lazyloadChildPaths(pageNumber) {
        this.childRow = pageNumber * 5;
        this.fieldMetaService.getChilds(this.id, (pageNumber - 1) * 5, 5).then((value: PathsDto[]) => {
            this.childsPath = value;
        });
    }

    lazyloadParentPaths(pageNumber) {
        this.parentRow = pageNumber * 5;
        this.fieldMetaService.getParents(this.id, (pageNumber - 1) * 5, 5).then((value: PathsDto[]) => {
            this.parentsPath = value;
        });
    }

    deleteField(childId, parentId, tableName) {
        swal.fire({
            title: 'آیا از حذف ارتباط اطمینان دارید؟',
            text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            if (result.value) {
                this.deleteRelationship.childId=childId;
                this.deleteRelationship.parentId=parentId;
                this.fieldMetaService.deleteRelationShip(this.deleteRelationship).then(value => {
                    if (tableName == 'parent') {
                        this.fieldMetaService.countParents(this.id).then((value: number) => {
                            this.parentSize = value;
                            this.ngbPaginationParent.page = 1
                            this.fieldMetaService.getParents(this.id, 0, 5).then((value: PathsDto[]) => {
                                this.parentsPath = value;
                                let setting: SweetAlertOptions = {};
                                this.searching = false;
                                setting.confirmButtonText = 'بستن';
                                setting.title = '!حدف شد';
                                setting.animation = true;
                                setting.text = '.ارتباط انتخاب شده حذف شد';
                                setting.type = 'success';
                                swal.fire(
                                    setting
                                )
                            });
                        });
                    } else {
                        this.fieldMetaService.countChild(this.id).then((value: number) => {
                            this.childSize = value;
                            this.ngbPaginationChild.page = 1
                            this.fieldMetaService.getChilds(this.id, 0, 5).then((value: PathsDto[]) => {
                                this.childsPath = value;
                                let setting: SweetAlertOptions = {};
                                this.searching = false;
                                setting.confirmButtonText = 'بستن';
                                setting.title = '!حدف شد';
                                setting.animation = true;
                                setting.text = '.ارتباط انتخاب شده حذف شد';
                                setting.type = 'success';
                                swal.fire(
                                    setting
                                )
                            })
                        })
                    }
                }).catch(err => {
                    this.toastr.error(err.error.message);
                });
            }
        })
    }

    open(content) {
        this.selectedHistoryId = null;
        this.firstSelectedRelationName = 'مبانی';
        this.addChild = true;
        this.placeHolder = 'فرزند جدید';
        this.secondRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
        this.firstRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];

        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsSize = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
                this.searching = false;
            });
        });

        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    openForAddParent(content) {
        this.addChild = false;
        this.selectedHistoryId = null;
        this.firstSelectedRelationName = 'مبانی';
        this.placeHolder = 'پدر جدید';
        this.secondRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
        this.firstRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];

        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsSize = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
                this.searching = false;
            });
        });

        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    public onselectField(fieldId) {
        this.selectedFieldId = fieldId;
    }

    onScrollToEnd() {
        this.searchChild(null);
    }

    close() {
        this.filterName = '';
        this.fieldMetaLen = 0;
        this.loading = true;
        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsSize = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
                this.loading = false;
                this.change.detectChanges();
            }).catch(reason => {
                this.loading = false;
                this.toastr.error(reason.error.message);
            });
        })
    }

    onScroll({end}) {
        if (this.loading || this.fields.length <= this.fieldsSize) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.fieldsSize) {
            this.searchChild(null);
        }
    }

    searchChild(event) {
        this.loading = true;
        this.fieldMetaLen += 1;
        this.fieldMetaService.searchSuggestion(this.filterName, this.fieldMetaLen, 10).then((value: FieldMeta[]) => {
            this.fields = [...this.fields, ...value];
            this.fieldMetaLen += 1;
            this.loading = false;
        }).catch(reason => {
            this.loading = false;
        });
    }

    onSearch(event) {
        this.fieldMetaLen = 0;
        this.filterName = event.term;
        let wordSearch = this.filterName;
        setTimeout(() => {
                if (wordSearch == this.filterName) {
                    this.loading = true;
                    this.fieldMetaService.countSearchSuggestion(event.term).then(value => {
                        this.fieldsSize = value;
                        this.fieldMetaService.searchSuggestion(event.term, this.fieldMetaLen, 10).then((value: FieldMeta[]) => {
                            this.fields = value;
                            this.change.detectChanges();
                            this.loading = false;
                        }).catch(reason => {
                            this.loading = false;
                            this.toastr.error(reason.error.message);
                        });
                    })
                }
            }
            ,
            500
        )

    }


    onSelect(id) {
        this.selectedFieldId = id;
    }

    resetSecondSelect() {
        this.secondSelectedRelationName = 'مبانی';
        this.secondRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
    }

    resetFirstSelect() {
        this.firstSelectedRelationName = 'مبانی';
        this.firstRelationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
    }

    showDetail() {
        this.fieldMetaService.getFieldMetaById(this.selectedHistoryId).then((value: FieldMeta) => {
            this.selectedFieldMeta = value;
            this.showInf = true;
        });
    }

    goForAdd() {
        if (this.firstSelectedRelationName || this.firstSelectedRelationName.length > 2) {
            if (this.addChild) {
                this.addAsChild(this.childDto, this.selectedHistoryId, this.firstSelectedRelationName);
            } else {
                this.addAsParent(this.childDto, this.selectedHistoryId, this.firstSelectedRelationName);
            }
        } else {
            this.toastr.error('نوع رابطه انتخاب نشده است');
        }

    }

    closeModal() {
        this.resetFirstSelect();
        this.selectedHistoryId = null;
        this.modalService.dismissAll();
    }

    AddNodeAndRelation() {
        if (this.secondSelectedRelationName && this.secondSelectedRelationName.length > 2) {
            this.newField.relationName = this.secondSelectedRelationName;
            this.newField.hasAccess = this.hasAccess;
            if (this.addChild) {
                this.newField.parentId = this.id;
                this.fieldService.addNewField(this.newField).then(res => {
                    this.newField = {keywords:[]};
                    this.hasAccess = true;
                    this.keywords = [];
                    this.fieldMetaService.countChild(this.id).then((value: number) => {
                        this.childSize = value;
                        this.selectedValue = '1';
                        this.modalService.dismissAll();
                        this.childDto = {};
                        let setting: SweetAlertOptions = {};
                        setting.confirmButtonText = 'بستن';
                        setting.title = '!اضافه شد';
                        setting.animation = true;
                        setting.text = '.فرزند مورد نظر اضافه شد';
                        setting.type = 'success';
                        setTimeout(() => {
                            this.newFieldForm.reset();
                        }, 3000)
                        swal.fire(
                            setting
                        )
                        this.fieldMetaService.getChilds(this.id, 0, 5).then((value: PathsDto[]) => {
                            this.childsPath = value;
                        });
                        this.fields = [];
                        this.fieldsSize = 0;
                    })

                })
            } else {
                this.fieldService.createNodeWithReturnId(this.newField).then(res => {
                    this.newField = {keywords:[]};
                    this.hasAccess = true;
                    this.keywords = [];
                    this.childDto = {};
                    this.addAsParent(this.childDto, res, this.secondSelectedRelationName);

                })
            }
        } else {
            this.toastr.error('نوع رابطه انتخاب نشده است');
        }
    }

    private addAsParent(node: ChildDto, parentId: number, relationName: string) {
        node.childId = this.id;
        node.relationName = relationName;
        node.parentId = parentId;
        this.fieldMetaService.addChildToParent(node).then(value => {
            this.fieldMetaService.countParents(this.id).then((value: number) => {
                this.parentSize = value;
                this.selectedValue = '1';
                this.modalService.dismissAll();
                this.childDto = {};
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = '!اضافه شد';
                setting.animation = true;
                setting.text = '.پدر مورد نظر اضافه شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
                this.fieldMetaService.getParents(this.id, 0, 5).then((value: PathsDto[]) => {
                    this.parentsPath = value;
                    setTimeout(() => {
                        this.newFieldForm.reset();
                    }, 3000)
                });
                this.fields = [];
                this.fieldsSize = 0;
            })
        }).catch(reason => {
            this.toastr.error(reason.error.message);
            this.newFieldForm.reset();
        });
    }

    private addAsChild(node: ChildDto, childId: number, relationName: string) {
        node.parentId = this.id;
        node.childId = childId;
        node.relationName = relationName;
        this.fieldMetaService.addChildToParent(node).then(value => {
            this.fieldMetaService.countChild(this.id).then((value: number) => {
                this.childSize = value;
                this.selectedValue = '1';
                this.modalService.dismissAll();
                this.childDto = {};
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = '!اضافه شد';
                setting.animation = true;
                setting.text = '.فرزند مورد نظر اضافه شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
                this.fieldMetaService.getChilds(this.id, 0, 5).then((value: PathsDto[]) => {
                    this.childsPath = value;
                    setTimeout(() => {
                        this.newFieldForm.reset();
                    }, 3000)
                });
                this.fields = [];
                this.fieldsSize = 0;
            })
        }).catch(reason => {
            this.toastr.error(reason.error.message);
            this.newFieldForm.reset();
        });
    }

    goForDetail(id: number) {
        this.subs.unsubscribe();
        this.tabSet.activeId = 'info';
        this.router.navigate(['/dashboard/fieldMeta'], {queryParams: {id: id}}).then(res=>{
            this.ngOnInit();
        });
    }

    private loadData() {
        this.fieldMetaService.getFieldMetaById(this.id).then((value: FieldMeta) => {
            this.fieldMeta = value;
            this.tagsName = this.fieldMeta.keywords;
        });
        this.fieldMetaService.getFieldById(this.id).then((value: Field) => {
            this.field = value;
        });

        this.fieldService.fieldDepth(this.id).then((value: number) => {
            this.distance = value;
        });
    }

    onadd(event) {
        this.newField.keywords.push(event.value);
        console.log('this.new', this.newField)
    }
    onRemove(event) {
        var idx = this.newField.keywords.indexOf(event.value);
        this.newField.keywords.splice(idx, 1);
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
