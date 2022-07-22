import {Component, OnInit} from '@angular/core';
import {UnitType} from '../model/unit-type';
import {UniversityService} from '../../shared/service/university.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {EducationRate} from '../model/education-rate';

@Component({
    selector: 'app-education-org-type',
    templateUrl: './education-org-type.component.html',
    styleUrls: ['./education-org-type.component.scss']
})
export class EducationOrgTypeComponent implements OnInit {
    data: UnitType[] = [];
    dataLength;
    dataItems;
    public addForm: FormGroup;
    unitType: UnitType = {};

    constructor(private universityService: UniversityService,
                public modalService: NgbModal,
                private formBuilder: FormBuilder,
                private toa: ToastrService) {
    }

    ngOnInit() {
        this.addForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
        });
        this.universityService.getUnitTypeList().then(res => {
            this.data = res;
            this.dataLength = this.data.length;
            this.getTypeItems(1, 5)
        }).catch(err => {
            this.toa.error(err.error.message)
        })

    }

    getTypeItems(pageNumber, size) {
        var length = pageNumber * size > this.dataLength ? this.dataLength : pageNumber * size;
        this.dataItems = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.dataItems.push(this.data[i]);
        }
    }

    remove(id: number) {
        swal.fire({
            title: 'آیا از حذف نوع واحد علمی اطمینان دارید؟',
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
                this.universityService.removeUnitType(id).then(res => {
                    this.ngOnInit();
                    this.modalService.dismissAll();
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = '!انجام شد';
                    setting.animation = true;
                    setting.text = '.نوع واحد مورد نظر حدف شد';
                    setting.type = 'success';
                    swal.fire(
                        setting
                    )
                }).catch(err => {
                    this.toa.error(err.error.message);
                });
            }
        })
    }

    addUnitType() {
        this.universityService.saveUnitType(this.unitType).then(res => {
            this.modalService.dismissAll();
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!انجام شد';
            setting.animation = true;
            setting.text = '.آیتم مورد نظر ثبت شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.ngOnInit();
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }

    edit(item: UnitType, content) {
        this.unitType = Object.assign({}, item);
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    openNewUnit(content) {
        this.unitType = {};
        this.addForm.reset();
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }
}
