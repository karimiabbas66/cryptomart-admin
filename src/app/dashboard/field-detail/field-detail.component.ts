import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Field} from '../field/Field';
import {FieldMeta} from '../field-meta/model/FieldMeta';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FieldMetaService} from '../field-meta/fieldMetaService';
import {ToastrService} from 'ngx-toastr';
import {FieldService} from '../field/FieldService';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {FieldType} from '../field-meta/model/FieldType';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-field-detail',
    templateUrl: './field-detail.component.html',
    styleUrls: ['./field-detail.component.scss']
})
export class FieldDetailComponent implements OnInit {

    public fieldDetailForm: FormGroup;
    newField: Field = new Field();
    fields: FieldMeta[] = [];
    fieldsCount: number;
    selectedFieldMeta: FieldMeta = {};
    fieldsSize: number = 0;
    closeResult: string;
    relationNames: string[] = [];
    fieldTypes: FieldType[];
    loading: boolean = false;
    fieldMetaLen: number = 0;
    input$ = new Subject<string>();
    numberOfItemsFromEndBeforeFetchingMore = 10;
    searchinput='';
    hasAccess: boolean=true;

    constructor(private formBuilder: FormBuilder,
                private fieldMetaService: FieldMetaService,
                private toastr: ToastrService,
                private modalService: NgbModal,
                private fieldService: FieldService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.hasAccess = true;
        this.fieldTypes = [{name: 'علمی', value: 1}, {name: 'پژوهشی', value: 2}]
        this.relationNames = [
            'مبانی',
            'درجه دوم',
            'مباحث عام',
            'مباحث تخصصی',
            'حوزه ها و مصادیق',
            'میان رشته ای',
            'سایر'
        ];
        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsCount = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
            });
        });
        this.fieldDetailForm = this.formBuilder.group({
            fieldName: new FormControl('', [Validators.required]),
            fieldTypes: new FormControl('', [Validators.required]),
            hasAccess: new FormControl(1, ),
            description: new FormControl('', ),
            describe: new FormControl('', ),
            parentName: '',
            relationName: '',
            keywords: ''
        });
        this.hasAccess = true;
    }

    addNewField(fieldDetailForm) {
        this.newField.hasAccess = this.hasAccess;
        this.newField.isShownInAddress = false;
        this.newField.isVertical = false;

        this.newField.hasChild = false;
        if (!(this.newField.relationName == null && this.newField.parentId != null) &&
            !(this.newField.relationName != null && this.newField.parentId == null)) {
            this.fieldService.addNewField(this.newField).then(value => {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = '!ایجاد شد';
                setting.animation = true;
                setting.text = '.نمایه ی مورد نظر ایجاد شد';
                setting.type = 'success';
                swal.fire(setting);
                fieldDetailForm.reset();
                this.fieldMetaService.countSearchSuggestion('').then(value => {
                    this.fieldsCount = value;
                    this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                        this.fields = value;
                        this.fieldMetaLen = 0;
                        this.newField = {keywords:[]};
                    });
                });
            }).catch(reason => {
                this.toastr.error(reason.error.message)
            });
        } else {
            this.toastr.error('لطفا هر دو فیلد رابطه و پدر را انتخاب کنید')
        }
    }

    open(content) {
        if (this.newField.parentId) {
            this.fieldMetaService.getFieldMetaById(this.newField.parentId).then((value: FieldMeta) => {
                this.selectedFieldMeta = value;
            });
            this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.modalService.dismissAll();
            });
        }
    }

    onSelect(item) {
        this.modalService.dismissAll();
        this.newField.parentId = item.id;
    }

    onadd(event) {
        this.newField.keywords.push(event.value);
    }

    onRemove(event) {
        var idx = this.newField.keywords.indexOf(event.value);
        this.newField.keywords.splice(idx, 1);
    }

    onScrollToEnd() {
        this.searchParent(null);
    }

    onScroll(end) {
        if (this.loading || this.fields.length <= this.fieldsCount) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.fieldsCount) {
            this.searchParent(null);
        }
    }

    searchParent(event) {
        this.loading=true;
        this.fieldMetaLen += 1;
        this.fieldMetaService.searchSuggestion(this.searchinput, this.fieldMetaLen, 10).then((value: FieldMeta[]) => {
            this.fields = [...this.fields, ...value];
            this.loading=false;
            this.change.detectChanges();
        }).catch(reason => {
            this.loading=false;
            this.toastr.error(reason.error.message);
        });
    }


    onSearch(event) {
        this.fieldMetaLen = 0;
        this.searchinput = event.term;
        let wordSearch = this.searchinput;
        setTimeout(() => {
                if (wordSearch == this.searchinput) {
                    this.loading=true;
                    this.fieldMetaService.countSearchSuggestion(event.term).then(value => {
                        this.fieldsCount = value;
                        this.fieldMetaService.searchSuggestion(event.term, 0, 10).then((value: FieldMeta[]) => {
                            this.fields = value;
                            this.loading=false;
                            this.change.detectChanges();
                        }).catch(reason => {
                            this.loading=false;
                            this.toastr.error(reason.error.message);
                        });
                    })
                }
            }
            ,
            500
        )

    }


    onCancel() {
        this.newField.parentId = null;
        this.modalService.dismissAll();
    }

    onSubmit() {
        this.modalService.dismissAll();
    }

    close(){
        this.loading=true;
        this.fieldMetaLen=0;
        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsCount = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
                this.loading=false;
                this.change.detectChanges();
            }).catch(reason => {
                this.loading=false;
                this.toastr.error(reason.error.message);
            });
        })
    }


}
