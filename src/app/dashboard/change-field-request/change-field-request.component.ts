import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ChangeFieldRequestService} from '../field-meta/ChangeFieldRequestService';
import {ChangeFieldRequest} from '../field-meta/model/ChangeFieldRequest';
import {ToastrService} from 'ngx-toastr';
import {ChangeRequestStatus} from '../field-meta/model/ChangeRequestStatus';

import {ModalDismissReasons, NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Field} from '../field/Field';
import {FieldMetaService} from '../field-meta/fieldMetaService';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {PersonalService} from '../../profile/personal/personal.service';
import {Personal} from '../../profile/shared/dto/Personal';

@Component({
    selector: 'app-change-field-request',
    templateUrl: './change-field-request.component.html',
    styleUrls: ['./change-field-request.component.scss']
})
export class ChangeFieldRequestComponent implements OnInit {
    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    pagesize = 5;
    totalRecords = 0;
    closeResult: string;
    changeField: Field = {};
    childFieldRequest: Field = {};
    personal: Personal = {};
    changeFieldRequests: ChangeFieldRequest[] = [];
    changeRequestStatus: ChangeRequestStatus = {};
    selectedRequest: ChangeFieldRequest = {};


    constructor(private changeFieldRequestService: ChangeFieldRequestService,
                private change: ChangeDetectorRef,
                private modalService: NgbModal,
                private personalService: PersonalService,
                private fieldMetaService: FieldMetaService,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.changeFieldRequestService.countAll().then(value => {
            this.totalRecords = value;
        }).catch(reason => {
            this.toast.error(reason.error.message);
        })
        this.changeFieldRequestService.getAll(0, this.pagesize).then(value => {
            this.changeFieldRequests = value;
        }).catch(reason => {
            this.toast.error(reason.error.message);
        })
    }

    changeStatus(status: boolean) {
        this.changeRequestStatus.status = status;
        this.changeRequestStatus.requestId = this.selectedRequest.requestId;
        this.selectedRequest.requestStatus=status;
        this.change.detectChanges();
        this.changeFieldRequestService.changeStatus(this.changeRequestStatus).then(value => {
            if (this.changeRequestStatus.status) {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'تایید شد!';
                setting.animation = true;
                setting.text = 'درخواست مورد نظر تایید شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
            } else {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'رد شد!';
                setting.animation = true;
                setting.text = 'درخواست مورد نظر رد شد';
                setting.type = 'error';
                swal.fire(
                    setting
                )
            }

        }).catch(reason => {
            this.toast.error(reason.error.message)
        })
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'با فشردن ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'با کلیک کردن یک backdrop';
        } else {
            return `با: ${reason}`;
        }
    }

    lazyLoad(pagenumber) {
        this.changeFieldRequestService.getAll(pagenumber - 1, this.pagesize).then(value => {
            this.changeFieldRequests = value;
        }).catch(reason => {
            this.toast.error(reason.error.message);
        })
    }

    changePageSize() {
        this.changeFieldRequestService.getAll(0, this.pagesize).then(value => {
            this.changeFieldRequests = value;
            this.ngbPagination.page = 1
            this.change.detectChanges();
        }).catch(reason => {
            this.toast.error(reason.error.message);
        })

    }


    openModal(content, selected: ChangeFieldRequest): any {
        this.selectedRequest = selected;
        this.fieldMetaService.getFieldById(selected.fieldId).then((field: Field) => {
            this.changeField = field;
            this.personalService.getPersonalInformation(selected.requestBy).then(data => {
                this.personal = data;
                if (this.selectedRequest.changeFieldRequestType === 'ADD_CHILD_TO_PARENT' || this.selectedRequest.changeFieldRequestType === 'DELETE_RELATIONSHIP') {
                    this.fieldMetaService.getFieldById(this.selectedRequest.request.childId).then((field: Field) => {
                        this.childFieldRequest = field;
                    }).catch(reason => {
                        this.toast.error(reason.error.message)
                    })
                }
                console.log(this.selectedRequest)
                console.log(this.changeField)
                this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;
                }, (reason) => {
                    this.modalService.dismissAll();
                });
            }).catch(reason => {
                this.toast.error(reason.error.message)
            })
        }).catch(reason => {
            this.toast.error(reason.error.message)
        });


    }


}
