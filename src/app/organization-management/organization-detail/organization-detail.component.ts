import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CityModel} from '../../sources/shared/dto/city.model';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {OrganizationService} from '../shared/service/organization.service';
import {OrganizationModel} from '../shared/dto/organization.model';
import {OrganizationTypeModel} from '../shared/dto/organization-type.model';
import {AppSettings} from '../../pages/shared/AppSettings';
import {CityServices} from '../university/city-services.service';
import {Contact} from '../../profile/shared/dto/Contact';
import {ISubscription} from 'rxjs-compat/Subscription';
import swal from "sweetalert2";

@Component({
    selector: 'app-organization-detail',
    templateUrl: './organization-detail.component.html',
    styleUrls: ['./organization-detail.component.scss']
})
export class OrganizationDetailComponent implements OnInit {

    public organizationDetailForm: FormGroup;
    public organizationId: number;
    public organization: OrganizationModel = {};
    @Input() public modal: boolean;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    provinces: CityModel[] = [];
    cities: CityModel[] = [];
    city: CityModel;
    province: CityModel;
    organizationTypes: OrganizationTypeModel[] = [];
    organizationOwners: OrganizationTypeModel[] = [];
    selectedType: OrganizationTypeModel;
    selectedOwner: OrganizationTypeModel;
    imageToShowLicense: any;
    imageToShowLogo: any;
    public isImageLoading = false;
    licensePlaceholder: string = 'لطفا عکس مجوز را انتخاب و بارگذاری کنید';
    logoPlaceholder: string = 'لطفا عکس لوگو را انتخاب و بارگذاری کنید';
    contactForm: FormGroup;
    on = true;
    public contentTypeSelect = Array(
        {name: 'موبایل', value: 'MOBILE', avatar: '../../assets/img/color/007bff.png'},
        {name: 'تلفن', value: 'PHONE', avatar: '../../assets/img/color/FF8D60.png'},
        {name: 'ایمیل', value: 'EMAIL', avatar: '../../assets/img/color/20c997.png'},
    )
    public contact: { type?: string, content?: string, contactName?: string };
    private unsubscribe: ISubscription;


    constructor(private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private cityService: CityServices,
                private route: ActivatedRoute,
                private organizationService: OrganizationService) {

    }

    ngOnInit() {
        this.contact = {};
        this.organization.contacts = [];

        this.organizationService.getAllOrganizationOwners(0, 10).then(res => {
            this.organizationOwners = res;
        });
        this.organizationService.getAllOrganizationType(0, 20).then(res => {
            this.organizationTypes = res;
        });

        this.cityService.getAllProvince(0, 50).then((res: CityModel[]) => {
            this.provinces = res;
        });

        this.organizationDetailForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required]),
            licenseNumber: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            province: new FormControl(''),
            file2: new FormControl(''),
            file1: new FormControl(''),
            city: new FormControl(''),
            type: new FormControl(''),
            owner: new FormControl(''),
            typeDescription: new FormControl(''),
            ownerDescription: new FormControl(''),
            confirmed: new FormControl(''),
            address: new FormControl(''),
            postalCode: new FormControl('', [Validators.minLength(10)]),
            managerName: new FormControl(''),
        });
        this.contactForm = this.formBuilder.group({
            contactType: new FormControl(null, [Validators.required]),
            content: new FormControl(null, [Validators.required]),
            contactName: new FormControl(null),

        });
        this.unsubscribe = this.contactForm.get('contactType')
            .valueChanges.subscribe(data => {
                if (data) {
                    this.contact.type = data.value;
                    this.contactForm.get('content').setValue(null);
                }
            });

        this.unsubscribe = this.contactForm.get('content')
            .valueChanges.subscribe(data => {
                if(data){
                    this.contact.content = data;
                }
            });

        this.unsubscribe = this.contactForm.get('contactName')
            .valueChanges.subscribe(data => {
                if(data){
                    this.contact.contactName = data;
                }
            });

        this.route.queryParams.subscribe(params => {
            this.organizationId = params['id'];
            if (this.organizationId) {
                this.organizationService.getOrganizationModel(this.organizationId).then((res: OrganizationModel) => {
                    this.organization = res;
                    if (res.cityId != null) {
                        this.city = {id: res.cityId, title: res.cityName};
                        this.province = {id: res.provinceId, title: res.provinceName};
                    }
                    if (!this.organization.contacts) {
                        this.organization.contacts = [];
                    }
                    if (res.organizationOwnerId) {
                        this.selectedOwner = {
                            id: res.organizationOwnerId, name:
                            this.organizationOwners.filter(or => or.id == res.organizationOwnerId)[0].name
                        }
                    }
                    if (res.logoUuid) {
                        this.getImageFromService(res.logoUuid, 'logo');
                    }
                    if (res.licenseFileUuid) {
                        this.getImageFromService(res.licenseFileUuid, 'license');
                    }

                    if (res.organizationTypeId) {
                        this.selectedType = {
                            id: res.organizationTypeId, name:
                            this.organizationTypes.filter(or => or.id == res.organizationTypeId)[0].name
                        }
                    }
                })
            }
        });
        this.goForContactValidation();
        this.goForOffAndOn();
    }

    onSelectPublisher(event: any) {
        if (event != undefined) {
            this.cityService.getByProvinceId(event.id).then((res: CityModel[]) => {
                this.cities = res;
            });
        }
    }

    edit() {
        console.log('this.city::', this.city);
        this.city ? this.organization.cityId = this.city.id : this.organization.cityId = null;
        this.selectedType ? this.organization.organizationTypeId = this.selectedType.id : this.organization.organizationTypeId = null;
        this.selectedOwner ? this.organization.organizationOwnerId = this.selectedOwner.id : this.organization.organizationOwnerId = null;
        this.organizationService.saveNewOrganization(this.organization).then(res => {
            if (this.modal == true) {
                this.passEntry.emit(res);
            } else {
                this.router.navigate(['/organization-management/organization-list'], {relativeTo: this.route.parent});
            }
            this.toastr.success('اطلاعات سازمان با موفقیت ثبت شد');
        }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

    getImageFromService(uuid, file: string) {
        this.organizationService.getImage(uuid).subscribe(data => {
            this.createImageFromBlob(data, file);
        }, error => {
            console.log(error);
        });
    }

    createImageFromBlob(image: Blob, file: string) {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            if (file === 'logo') {
                this.imageToShowLogo = reader.result;
            } else {
                this.imageToShowLicense = reader.result;
            }
            this.isImageLoading = true;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    afterUploadLicenses(event) {
        this.organization.licenseFileUuid = event;
        this.getImageFromService(event, 'license');
    }

    afterUploadLogo(event) {
        this.organization.logoUuid = event;
        this.getImageFromService(event, 'logo');
    }

    createContact() {
        this.organization.contacts.push({content: this.contact.content, type: this.contact.type, contactName: this.contact.contactName})
        this.contactForm.reset()
    }

    private goForOffAndOn() {
        setTimeout(() => {
            this.on = !this.on;
            this.goForOffAndOn();
        }, 500);
    }

    deleteContact(id: number) {
        swal.fire({
            title: 'آیا از حذف این داده اطمینان دارید؟',
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
                this.organization.contacts.splice(id, 1);
            }
        })
    }
    private goForContactValidation() {
        this.contactForm.get('contactType').valueChanges
            .subscribe(type => {
                if(type){
                    if (type.value == 'EMAIL') {
                        this.contactForm.get('content').setValidators([Validators.email]);
                    }

                    if (type.value == 'PHONE') {
                        this.contactForm.get('content').setValidators([Validators.pattern('^[0][1-9]{1}[0-9]{9}$'), Validators.required]);
                    }

                    if (type.value == 'MOBILE') {
                        this.contactForm.get('content').setValidators([Validators.pattern('^[0][9]{1}[0-9]{9}$'), Validators.required]);
                    }
                }

                this.contactForm.get('content').updateValueAndValidity();
            });
    }


}
