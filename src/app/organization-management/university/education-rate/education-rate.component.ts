import {Component, OnInit} from '@angular/core';
import {EducationRate} from '../model/education-rate';
import {UniversityService} from '../../shared/service/university.service';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UnitType} from '../model/unit-type';

@Component({
    selector: 'app-education-rate',
    templateUrl: './education-rate.component.html',
    styleUrls: ['./education-rate.component.scss']
})
export class EducationRateComponent implements OnInit {

    data: EducationRate[] = [];
    dataLength;
    dataItems;
    deletedTypes: number[] = [];
    typeList: UnitType[];
    addTypes: number[] = [];
    selectedTypes: any[];
    public educationRateTypeForm: FormGroup;
    newEducationRate: EducationRate = {};
    editEducationRate: EducationRate = {};

    constructor(private universityService: UniversityService,
                public modalService: NgbModal,
                private formBuilder: FormBuilder,
                private toa: ToastrService) {
    }

    ngOnInit() {
        this.selectedTypes = []
        this.educationRateTypeForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            rateType: new FormControl(1, [Validators.required]),
            priority: new FormControl(1, [Validators.required]),
        });
        this.universityService.getAllEducationRate().then(res => {
            this.data = res;
            this.dataLength = this.data.length;
            this.getDegreeItems(1, 5);
        }).catch(err => {
            this.toa.error(err.error.message)
        })

        this.universityService.getUnitTypeList().then(value => {
            this.typeList = value;
        }).catch(reason => {

        })
    }

    deleteTypes(event) {
        console.log(event)
        this.deletedTypes.push(event.value.id);
        console.log(this.deleteTypes)
    }

    addType(event) {
        console.log(event)
        this.addTypes.push(event.id);
    }

    getDegreeItems(pageNumber, size) {
        var length = pageNumber * size > this.dataLength ? this.dataLength : pageNumber * size;
        this.dataItems = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.dataItems.push(this.data[i]);
        }
    }

    edit(item: EducationRate, content) {
        this.universityService.findAllTypeByDegreeId(item.degreeId).then((value: UnitType[]) => {
            this.selectedTypes = value.map(value1 => value1.id);
            this.deletedTypes = [];
            this.addTypes = [];
            this.newEducationRate = Object.assign({}, item);
            this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            }, (reason) => {
                this.modalService.dismissAll();
            });
        }).catch(reason => {

        })
    }

    remove(id: number) {
        swal.fire({
            title: 'آیا از حذف مدرک اطمینان دارید؟',
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
                this.universityService.removeEducationRate(id).then(res => {
                    this.modalService.dismissAll();
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = 'حذف شد!';
                    setting.animation = true;
                    setting.text = '.مدرک مورد نظر حذف شد';
                    setting.type = 'success';
                    swal.fire(
                        setting
                    )
                    this.ngOnInit();
                }).catch(err => {
                    this.toa.error(err.error.message);
                });
            }
        })
    }

    openAddAndEditPage(content) {
        this.deletedTypes = [];
        this.addTypes = [];
        this.newEducationRate = {}
        this.educationRateTypeForm.reset();
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    addNewRate() {
        //for cast string to number because of string result of radio input
        this.newEducationRate.types = this.addTypes;
        this.newEducationRate.deletedTypes = this.deletedTypes;
        this.newEducationRate.degreeType = +this.newEducationRate.degreeType;
        console.log(this.newEducationRate)
        this.universityService.saveEducationRate(this.newEducationRate).then(res => {
            this.modalService.dismissAll();
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!انجام شد';
            setting.animation = true;
            setting.text = '.مدرک مورد نظر ثبت شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.ngOnInit();
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }

    editRate() {
        //for cast string to number because of string result of radio input
        this.newEducationRate.degreeType = +this.newEducationRate.degreeType;
        this.universityService.saveEducationRate(this.newEducationRate).then(res => {
            this.modalService.dismissAll();
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!انجام شد';
            setting.animation = true;
            setting.text = '.مدرک مورد نظر ثبت شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.ngOnInit();
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }

    increasePriority() {
        this.newEducationRate.priority++;
    }

    decreasePriority() {
        this.newEducationRate.priority--;
    }
}
