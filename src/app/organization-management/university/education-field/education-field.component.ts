import {Component, OnInit, ViewChild} from '@angular/core';
import {EducationField} from '../model/education-field';
import {UniversityService} from '../../shared/service/university.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {FieldOrientation} from '../model/field-orientation';

@Component({
    selector: 'app-education-field',
    templateUrl: './education-field.component.html',
    styleUrls: ['./education-field.component.scss']
})
export class EducationFieldComponent implements OnInit {

    @ViewChild('addSecondGroup', {static: false}) public modal: NgbModal;
    firstGroup: EducationField[] = [];
    secondGroup: EducationField[] = [];
    thirdGroup: EducationField[] = [];

    pageSize = 5;
    countAllField;
    countAllOrientation;
    group1Items;
    group2Items;
    group1Length;
    group2Length;
    secondGroupNgSelect: EducationField[] = []
    public firsEducationFieldForm: FormGroup;
    public secondEducationFieldForm: FormGroup;
    public fieldForm: FormGroup;
    newField: EducationField = {};
    selectedSecondFormFirstGroup: EducationField = {};
    selectedThirdFormFirstGroup: EducationField = {};
    selectedThirdFormSecondGroup: EducationField = {};
    orientationList: FieldOrientation[] = [];
    orientationItems: FieldOrientation[] = [];
    newFieldOrientation: FieldOrientation = {};

    constructor(private universityService: UniversityService,
                public modalService: NgbModal,
                private formBuilder: FormBuilder,
                private toa: ToastrService) {
    }

    ngOnInit() {
        this.firsEducationFieldForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
        });

        this.secondEducationFieldForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
        });

        this.fieldForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            code:new FormControl('', [Validators.required])
        });

        this.universityService.getFirstEducationGroup().then(res => {
            this.firstGroup = res;
            this.group1Length = this.firstGroup.length;
            this.getGroup1Items(1, 5)
        }).catch(err => {
            this.toa.error(err.error.message)
        })

        this.universityService.getSecondEducationGroup().then(res => {
            this.secondGroup = res;
            this.group2Length = this.secondGroup.length;
            this.getGroup2Items(1, 5)
        }).catch(err => {
            this.toa.error(err.error.message)
        })

        this.universityService.countAllField().then(res => {
            this.countAllField = res;
        }).catch(err => {
            this.toa.error(err.error.message)
        })

        this.universityService.getThirdEducationGroup(0, this.pageSize).then(res => {
            this.thirdGroup = res;
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }

    getGroup1Items(pageNumber, size) {
        var length = pageNumber * size > this.group1Length ? this.group1Length : pageNumber * size;
        this.group1Items = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.group1Items.push(this.firstGroup[i]);
        }
    }

    getGroup2Items(pageNumber, size) {
        var length = pageNumber * size > this.group2Length ? this.group2Length : pageNumber * size;
        this.group2Items = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.group2Items.push(this.secondGroup[i]);
        }
    }

    getOrientationItems(pageNumber, size) {
        var length = pageNumber * size > this.countAllOrientation ? this.countAllOrientation : pageNumber * size;
        this.orientationItems = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.orientationItems.push(this.orientationList[i]);
        }
    }

    lazyLoadField(pageNumber) {
        this.universityService.getThirdEducationGroup(pageNumber, this.pageSize).then(res => {
            this.thirdGroup = res;
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }


    removeField(id: number) {
        swal.fire({
            title: 'آیا از حذف اطمینان دارید؟',
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
                this.universityService.removeEducationField(id).then(res => {
                    this.ngOnInit();
                }).catch(err => {
                    this.toa.error(err.error.message);
                });
            }
        })
    }

    addFirst() {
        this.newField.fieldType = 'GROUP1';
        this.addField();
    }

    addSecondField() {
        this.newField.fieldType = 'GROUP2';
        console.log(this.selectedSecondFormFirstGroup.fieldId)
        if (this.selectedSecondFormFirstGroup && this.selectedSecondFormFirstGroup.fieldId) {
            this.newField.firstParentId = this.selectedSecondFormFirstGroup.fieldId;
        }
        this.addField();
    }

    addThirdField() {
        this.newField.fieldType = 'FIELD';
        if (this.selectedThirdFormFirstGroup && this.selectedThirdFormFirstGroup.fieldId) {
            this.newField.firstParentId = this.selectedThirdFormFirstGroup.fieldId;
        }
        if (this.selectedThirdFormSecondGroup && this.selectedThirdFormSecondGroup.fieldId) {
            this.newField.secondParentId = this.selectedThirdFormSecondGroup.fieldId;
        }
        this.addField();
    }

    addField() {
        console.log(this.newField)
        this.universityService.saveField(this.newField).then(res => {
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

    initialAddDialog(content) {
        this.firsEducationFieldForm.reset();
        this.secondEducationFieldForm.reset();
        this.fieldForm.reset();
        this.newField = {};
        this.selectedThirdFormSecondGroup = {};
        this.selectedThirdFormFirstGroup = {};
        this.selectedSecondFormFirstGroup = {};
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    editFirstGroup(item: EducationField, content) {
        this.newField = Object.assign({},item);
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.newField.name = name;
            this.modalService.dismissAll();
        });
    }

    editSecondGroup(item: EducationField, content) {
        this.newField = Object.assign({},item);
        this.firstGroup.forEach(itItem => {
            if (itItem.fieldId == item.firstParentId) {
                this.selectedSecondFormFirstGroup = itItem;
                this.newField.firstParentId = itItem.fieldId;
            }
        })
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    editThird(content, item: EducationField) {
        this.newField = Object.assign({},item);
        this.firstGroup.forEach(itItem => {
            if (itItem.fieldId == item.firstParentId) {
                this.selectedThirdFormFirstGroup = itItem;
                this.newField.firstParentId = itItem.fieldId;
            }
        })

        this.loadSecond();
        this.secondGroupNgSelect.forEach(itItem => {
            if (itItem.fieldId == item.secondParentId) {
                this.selectedThirdFormSecondGroup = itItem;
                this.newField.secondParentId = itItem.fieldId;
            }
        })
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    resetSelect() {
        this.selectedSecondFormFirstGroup = {};
    }

    resetSecondNgSelect() {
        this.selectedThirdFormSecondGroup = {};
    }

    loadSecond() {
        this.secondGroupNgSelect = this.secondGroup.filter(value => value.firstParentId == this.selectedThirdFormFirstGroup.fieldId)
        this.selectedThirdFormSecondGroup = this.secondGroupNgSelect.length > 0 ? this.secondGroupNgSelect[0] : {};
    }

    resetFirstGroupSelect() {
        this.selectedThirdFormFirstGroup = {};
        this.selectedThirdFormSecondGroup = {};
        this.universityService.getSecondEducationGroup().then(res => {
            this.secondGroup = res;
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }

    openOrientation(content, fieldId) {
        this.universityService.getOrientationListByFieldId(fieldId).then(res => {
            this.orientationList = res;
            this.countAllOrientation = this.orientationList.length;
            this.getOrientationItems(1, 5);
            this.newFieldOrientation.fieldId = fieldId;
            this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            }, (reason) => {
                this.modalService.dismissAll();
            });
        })
    }

    removeOrientation(id: number) {
        swal.fire({
            title: 'آیا از حذف اطمینان دارید؟',
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
                this.universityService.removeFieldOrientation(id).then(res => {
                    this.universityService.getOrientationListByFieldId(this.newFieldOrientation.fieldId).then(res => {
                        this.orientationList = res;
                        this.countAllOrientation = this.orientationList.length;
                        this.getOrientationItems(1, 5);
                    })
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = '!حذف شد';
                    setting.animation = true;
                    setting.text = '.گرایش مورد نظر حذف شد';
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

    fillInput(item: FieldOrientation) {
        this.newFieldOrientation = item;
    }

    addNewOrientation() {
        this.universityService.saveOrientation(this.newFieldOrientation).then(res => {
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = 'ثبت شد!';
            setting.animation = true;
            setting.text = '.گرایش مورد نظر ثبت شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.universityService.getOrientationListByFieldId(this.newFieldOrientation.fieldId).then(res => {
                this.orientationList = res;
                this.countAllOrientation = this.orientationList.length;
                this.getOrientationItems(1, 5);
            })
        })
    }
}
