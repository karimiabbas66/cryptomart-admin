import {Component, OnDestroy, OnInit} from '@angular/core';
import {UnitType} from '../model/unit-type';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {UniversityService} from '../../shared/service/university.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Unit} from '../model/unit';
import {CityService} from '../../../sources/shared/service/city.service';
import {CityModel} from '../../../sources/shared/dto/city.model';
import {ISubscription} from 'rxjs-compat/Subscription';
import {UnitContact} from '../model/unit-contact';
import {CityServices} from '../city-services.service';

@Component({
    selector: 'app-education-org',
    templateUrl: './education-org.component.html',
    styleUrls: ['./education-org.component.scss']
})
export class EducationOrgComponent implements OnInit, OnDestroy {
    unitTypes: UnitType[] = [];
    selectedUnitType: UnitType = {};
    newUnit: Unit = {};
    public addForm: FormGroup;
    data: Unit[] = [];
    provinces: CityModel[] = [];
    province: CityModel;
    cities: CityModel[] = [];
    city: CityModel;
    public contact: UnitContact = {};
    listOfContact: UnitContact[] = [];
    contactForm: FormGroup;
    unitCount;
    private unsubscribe: ISubscription;

    public contentTypeSelect = Array(
        {name: 'موبایل', value: 'MOBILE', avatar: '../../assets/img/color/007bff.png'},
        {name: 'تلفن', value: 'PHONE', avatar: '../../assets/img/color/FF8D60.png'},
        {name: 'ایمیل', value: 'EMAIL', avatar: '../../assets/img/color/20c997.png'},
        {name: 'وب سایت', value: 'WEBSITE', avatar: '../../assets/img/color/ffc107.png'},
    )

    constructor(private universityService: UniversityService,
                public modalService: NgbModal,
                private formBuilder: FormBuilder,
                private cityService: CityServices,
                private toa: ToastrService) {
    }

    ngOnInit() {
        this.addForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            unitType: new FormControl(null, [Validators.required]),
            province: new FormControl(null),
            city: new FormControl(null),
            address: new FormControl(null),
        });
        this.contactForm = this.formBuilder.group({
            contactType: new FormControl(null, [Validators.required]),
            content: new FormControl(null, [Validators.required]),
        })
        this.universityService.getUnitTypeList().then(res => {
            this.unitTypes = res;
        })

        this.unsubscribe = this.contactForm.get('contactType')
            .valueChanges.subscribe(data => {
                if (data) {
                    this.contact.type = data.value;
                }
            })

        this.unsubscribe = this.contactForm.get('content')
            .valueChanges.subscribe(data => {
                if (data) {
                    this.contact.content = data;
                }
            })
        this.goForContactValidation();

        this.universityService.countUnit().then(res => {
            this.unitCount = res;
            this.universityService.getUnitList(0, 5).then(res => {
                this.data = res;
            })
        }).catch(err => {
            this.toa.error(err.error.message)
        })

        this.cityService.getAllProvince(0, 50).then((res: CityModel[]) => {
            this.provinces = res;
        });
    }

    resetSelect() {
        this.selectedUnitType = {};
    }

    lazyLoadUnits(pageNumber) {
        this.universityService.getUnitList(pageNumber-1, 5).then(res => {
            this.data = res;
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }

    private goForContactValidation() {
        this.contactForm.get('contactType').valueChanges
            .subscribe(type => {
                if (type) {
                    if (type.value == 'EMAIL') {
                        this.contactForm.get('content').setValidators([Validators.email]);
                    }

                    if (type.value == 'PHONE') {
                        this.contactForm.get('content').setValidators([Validators.pattern('^[0][1-9]{1}[0-9]{9}$'), Validators.required]);
                    }

                    if (type.value == 'MOBILE') {
                        this.contactForm.get('content').setValidators([Validators.pattern('^[0][9]{1}[0-9]{9}$'), Validators.required]);
                    }
                    if (type.value == 'WEBSITE') {
                        this.contactForm.get('content').setValidators([Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[//\\w .-]*/?'), Validators.required]);
                    }
                }

                this.contactForm.get('content').updateValueAndValidity();
            });
    }

    addUnit() {
        this.newUnit.unitContacts = this.listOfContact;
        this.newUnit.typeId = (this.selectedUnitType) ? this.selectedUnitType.id : null;
        this.newUnit.cityId = (this.city) ? this.city.id : null;
        this.newUnit.provinceId = (this.province) ? this.province.id : null;
        console.log('to be save is ', this.newUnit);
        this.universityService.saveUnit(this.newUnit).then(res => {
            this.ngOnInit();
            this.city = {};
            this.province = {};
            this.listOfContact = [];
            this.modalService.dismissAll();
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!انجام شد';
            setting.animation = true;
            setting.text = '.واحد مورد نظر ایجاد شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
        }).catch(err => {
            this.toa.error(err.error.message);
        });
    }

    openNewUnit(content) {
        this.newUnit = {};
        this.addForm.reset();
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    edit(item: Unit, content) {
        this.newUnit = Object.assign({},item);
        console.log(this.newUnit)
        this.unitTypes.forEach(item => {
            if (this.newUnit.typeId == item.id) {
                this.selectedUnitType = item;
            }
        })
        if (this.newUnit.unitContacts) {
            this.listOfContact = item.unitContacts;
        }
        if (this.newUnit.provinceId != null) {
            this.provinces.forEach(item => {
                if (item.id == this.newUnit.provinceId) {
                    this.province = item;
                }
            })
        }
        if (this.newUnit.cityId != null) {
            this.cityService.getByProvinceId(this.newUnit.provinceId).then((res: CityModel[]) => {
                this.cities = res;
                this.cities.forEach(item => {
                    if (item.id == this.newUnit.cityId) {
                        this.city = item;
                    }
                })
            });
        }
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    remove(id: number) {
        swal.fire({
            title: 'آیا از حذف  واحد علمی اطمینان دارید؟',
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
                this.universityService.removeUnit(id).then(res => {
                    this.ngOnInit();
                    this.modalService.dismissAll();
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = '!انجام شد';
                    setting.animation = true;
                    setting.text = '. واحد مورد نظر حدف شد';
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

    selectProvince(event) {
        if (event != undefined) {
            this.cityService.getByProvinceId(event.id).then((res: CityModel[]) => {
                this.cities = res;
            });
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe();
    }

    createContact() {
        console.log('this.contact', this.contact)
        this.listOfContact.push(this.contact);
        this.contact = {};
        this.contactForm.reset();
    }

    deleteContact(contact: { type?: string; content?: string }) {
        let number = this.listOfContact.indexOf(contact);
        this.listOfContact.splice(number, 1);
    }

    closeAll() {
        this.modalService.dismissAll();
    }

    manageFields(item) {

    }
}
