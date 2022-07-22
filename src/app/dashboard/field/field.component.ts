import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FieldLenght} from './FieldLenght';
import {FieldService} from './FieldService';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FieldMeta} from '../field-meta/model/FieldMeta';
import {FieldMetaService} from '../field-meta/fieldMetaService';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss']
})

export class FieldComponent implements OnInit {

    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    fields: FieldMeta[] = [];
    pagesize: number = 5;
    page: number = 1;
    selectedField: FieldLenght;
    totalRecords: number;
    loading: boolean;
    filterName: string = '';
    rowNumber: number = 0;
    searching;
    showProgress = false;
    disable:boolean=false;

    constructor(private fieldService: FieldService,private change: ChangeDetectorRef, private fieldMetaService: FieldMetaService, private router: Router, private toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.disable=false;
        this.showProgress = true;
        this.fieldMetaService.countSearchSuggestion(this.filterName).then(value => {
            this.totalRecords = value;
            if(this.totalRecords==0){
                this.disable=true;
            }
            this.fieldMetaService.searchSuggestion(this.filterName, 0, this.pagesize).then((value: FieldMeta[]) => {
                this.fields = value;
                this.showProgress = false;
            }).catch(err => {
                this.showProgress = false;
            });
        });

    }

    onchange() {
        let wordSearch = this.filterName;
        setTimeout(() => {
                if (wordSearch == this.filterName) {
                    this.searching = true;
                    this.fieldMetaService.countSearchSuggestion(this.filterName).then(value => {
                        if(this.totalRecords==0){
                            this.disable=true;
                        }else{
                            this.disable=false;
                        }
                        this.totalRecords = value;
                        this.fieldMetaService.searchSuggestion(this.filterName, 0, this.pagesize).then((value: FieldMeta[]) => {
                            this.fields = value;
                            this.showProgress = false;
                            this.searching = false;
                            this.ngbPagination.page=1
                            this.change.detectChanges();
                        }).catch(err => {
                            this.showProgress = false;
                        });

                    });
                }
            }
            ,
            500
        )

    }

    lazyloadFieldLenght(searchInput, pagenumber
        :
        number
    ) {
        this.showProgress = true;
        this.fieldMetaService.searchSuggestion(this.filterName, pagenumber - 1, this.pagesize).then((value: FieldMeta[]) => {
            this.fields = value;
            this.showProgress = false;
            this.rowNumber = pagenumber * this.pagesize - this.pagesize;
        }).catch(err => {
            this.showProgress = false;
        });
    }

    deleteField(fieldId) {
        swal.fire({
            title: 'آیا از حذف نمایه اطمینان دارید؟',
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
                this.showProgress = true;
                this.fieldService.deleteLeaf(fieldId).then(value => {
                    this.fieldMetaService.countSearchSuggestion(this.filterName).then(value => {
                        this.totalRecords = value;
                        if(this.totalRecords==0){
                            this.disable=true;
                        }else{
                            this.disable=false;
                        }
                        this.fieldMetaService.searchSuggestion(this.filterName, 0, this.pagesize).then((value: FieldMeta[]) => {
                            this.fields = value;
                            let setting: SweetAlertOptions = {};
                            this.ngbPagination.page=1;
                            this.searching = false;
                            this.showProgress = false;
                            this.change.detectChanges();
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.نمایه ی انتخاب شده حذف شد';
                            setting.type = 'success';
                            this.ngbPagination.page=1;
                            swal.fire(
                                setting
                            )
                        })
                    })
                }).catch(err => {
                    this.showProgress = false;
                    this.toastr.error(err.error.message);
                });
            }
        })
    }

    changePageSize() {
        this.fieldMetaService.searchSuggestion(this.filterName, 0, this.pagesize).then((value: FieldMeta[]) => {
            this.fields = value;
            this.rowNumber =  this.ngbPagination.page * this.pagesize - this.pagesize;
            this.ngbPagination.page=1
            this.change.detectChanges();
        }).catch(err => {
            this.toastr.error(err.error.message);
        });

    }

}




