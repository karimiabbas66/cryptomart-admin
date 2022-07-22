import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {UserEntityService} from '../shared/service/UserEntityService';
import {UserEntityAccessService} from '../shared/service/UserEntityAccessService';
import {FieldMeta} from '../../dashboard/field-meta/model/FieldMeta';
import {PersonalField} from '../shared/dto/PersonalField';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {FieldMetaAccessDto} from '../shared/dto/FieldMetaAccessDto';
import {ToastrService} from 'ngx-toastr';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {LayoutService} from '../../shared/services/layout.service';

@Component({
    selector: 'app-field-access',
    templateUrl: './field-access.component.html',
    styleUrls: ['./field-access.component.scss']
})
export class FieldAccessComponent implements OnInit {

    @Input() public userId: string
    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    currentUserFields: FieldMetaAccessDto[]=[] ;
    searchedUserFields: FieldMetaAccessDto[] ;
    searchedUserFieldsCount: number = 0;
    currentUserFieldsCount: number = 0;
    selectedField: FieldMetaAccessDto={};
    selectedFieldId:number;
    personalField: PersonalField;
    savedPersonalField: PersonalField[] = [];
    numberOfItemsFromEndBeforeFetchingMore = 10;
    hasAccessDown: boolean = false;
    selectedUserEntity;
    pageSize = 5;
    fieldMetaAccessLen=0;
    loading=false;
    filterName:string;

    constructor(private userEntityService: UserEntityService,
                private  userEntityAccessService: UserEntityAccessService,
                private toastr: ToastrService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.userEntityService.findUserEntityByUserId(this.userId).then((value) => {
            this.selectedUserEntity = value;

            this.userEntityAccessService.findUserFieldsId(value, '', 0, this.pageSize).then((value1: FieldMetaAccessDto[]) => {
                console.log(value1);
                this.searchedUserFields = value1;
            }).catch(reason => {
                console.log(reason)
            })
            this.userEntityAccessService.countUserFields(this.selectedUserEntity, '').then(value1 => {
                this.searchedUserFieldsCount = value1;
            }).catch(reason => {
                console.log(reason);
            })
            this.close();
        }).catch(reason => {
            console.log(reason);
        });
    }

    pageChange(pageNumber) {
        this.userEntityAccessService.findUserFieldsId(this.selectedUserEntity, '', pageNumber-1, this.pageSize).then((value1: any[]) => {
            this.searchedUserFields = value1;
        }).catch(reason => {
            console.log(reason);
        })
    }

    onScrollToEnd() {
        this.searchFields(null);
    }

    searchFields(event) {
        this.loading = true;
        this.fieldMetaAccessLen += 1;
        this.userEntityAccessService.findAnotherCurrentUserFieldsId(this.selectedUserEntity,this.filterName, this.fieldMetaAccessLen, 10).then((value: FieldMetaAccessDto[]) => {
            this.currentUserFields = [...this.currentUserFields, ...value];
            this.change.detectChanges();
            this.loading = false;
        });
    }

    onScroll({end}) {
        if (this.loading || this.currentUserFields.length <= this.currentUserFieldsCount) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.currentUserFieldsCount) {
            this.searchFields(null);
        }
    }

    onSearch(event) {
        this.fieldMetaAccessLen = 0;
        this.filterName = event.term;
        let wordSearch = this.filterName;
        setTimeout(() => {
                if (wordSearch == this.filterName) {
                    this.loading = true;
                    this.userEntityAccessService.countAnotherCurrentUserFields(this.selectedUserEntity,event.term).then(value => {
                        this.currentUserFieldsCount = value;
                        this.userEntityAccessService.findAnotherCurrentUserFieldsId(this.selectedUserEntity,event.term, this.fieldMetaAccessLen, 10).then((value: FieldMetaAccessDto[]) => {
                            this.currentUserFields = value;
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

    close() {
        this.filterName = '';
        this.fieldMetaAccessLen = 0;
        this.loading = true;
        this.userEntityAccessService.countAnotherCurrentUserFields(this.selectedUserEntity,'').then(value => {
            this.currentUserFieldsCount = value;
            this.userEntityAccessService.findAnotherCurrentUserFieldsId(this.selectedUserEntity,'', 0, 10).then((value: FieldMetaAccessDto[]) => {
                this.currentUserFields = value;
                this.loading = false;
                this.change.detectChanges();
            }).catch(reason => {
                console.log(reason);
                this.loading = false;
                this.toastr.error(reason.error.message);
            });
        })
    }

    delete(fieldId) {
        swal.fire({
            title: 'آیا از حذف دسترسی اطمینان دارید؟',
            text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            this.userEntityAccessService.deleteUserFieldAccess(this.selectedUserEntity, fieldId).then(value => {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'با موفقیت حذف شد';
                setting.animation = true;
                setting.text = 'دسترسی مورد نظر حذف شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
                this.ngOnInit();
            }).catch(reason => {
                this.toastr.error(reason.error.message);
            })
        }).catch(reason => {
            console.log(reason);
        })
    }

    onChange(){
        this.selectedField=this.currentUserFields.filter(value => value.id==this.selectedFieldId)[0];
    }
    save() {
        this.selectedField.addresses.forEach(value => {
            var personalField = new PersonalField();
            personalField.accessAddress = value;
            personalField.fieldId = this.selectedField.id;
            personalField.userEntityId = this.selectedUserEntity;
            personalField.accessDown = this.hasAccessDown;
            this.savedPersonalField.push(personalField);
        });
        console.log(this.savedPersonalField)
        this.userEntityAccessService.save(this.savedPersonalField).then(value => {
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = 'با موفقیت ثبت شد';
            setting.animation = true;
            setting.text = 'دسترسی مورد نظر ثبت شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.ngOnInit();

        }).catch(reason => {
            this.toastr.error(reason.error.message);
        });
    }

}
