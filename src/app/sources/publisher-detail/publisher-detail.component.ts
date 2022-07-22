import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {PublisherModel} from '../shared/dto/publisher.model';
import {PublisherService} from '../shared/service/publisher.service';
import {CityModel} from '../shared/dto/city.model';
import {CityService} from '../shared/service/city.service';
import {ISubscription} from 'rxjs-compat/Subscription';
import swal, {SweetAlertOptions} from "sweetalert2";
import {AppSettings} from '../../pages/shared/AppSettings';

@Component({
    selector: 'app-publisher-detail',
    templateUrl: './publisher-detail.component.html',
    styleUrls: ['./publisher-detail.component.scss']
})
export class PublisherDetailComponent implements OnInit {

    public publisherDetailForm: FormGroup;
    public publisherId: number;
    public publisher: PublisherModel = {};
    downloadUrl= AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    @Input() public modal: boolean;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    provinces: CityModel[] = [];
    cities: CityModel[] = [];
    city: CityModel;
    province: CityModel;
    public isImageLoading = false;
    placeholder: string = 'لطفا عکس مجوز را انتخاب و بارگذاری کنید';
    imageToShowLicense: any;
    contactForm: FormGroup;
    on = true;
    public contentTypeSelect = Array(
        {name: 'موبایل', value: 'MOBILE', avatar: '../../assets/img/color/007bff.png'},
        {name: 'تلفن', value: 'PHONE', avatar: '../../assets/img/color/FF8D60.png'},
        {name: 'ایمیل', value: 'EMAIL', avatar: '../../assets/img/color/20c997.png'},
    )
    public contact: { type?: string, content?: string };
    private unsubscribe: ISubscription;

    constructor(private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private cityService: CityService,
                private route: ActivatedRoute,
                private publisherService: PublisherService) {

    }

    ngOnInit() {
        this.contact = {};
        this.publisher.contacts = [];
        this.publisherDetailForm = this.formBuilder.group({
            publisherName: new FormControl('', [Validators.required]),
            licenseNumber: new FormControl('', [Validators.required]),
            province: new FormControl(''),
            city: new FormControl(''),
            address: new FormControl(''),
            phoneNumber: new FormControl(''),
            confirmed: new FormControl(''),
            postalCode: new FormControl(''),
            managerName: new FormControl(''),
            description: new FormControl(''),
        });

        this.contactForm = this.formBuilder.group({
            contactType: new FormControl(null, [Validators.required]),
            content: new FormControl(null, [Validators.required]),
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

        this.route.queryParams.subscribe(params => {
            this.publisherId = params['id'];
            if (this.publisherId) {
                this.publisherService.getPublisherModel(this.publisherId).then((res: PublisherModel) => {
                    this.publisher = res;
                    if (res.cityId != null) {
                        this.city = {id: res.cityId, title: res.cityName};
                        this.province = {id: res.provinceId, title: res.provinceName};
                    }
                    if (this.publisher.licenseFileUuid) {
                        this.getImageFromService(this.publisher.licenseFileUuid);
                    }
                });


            }
        });

        this.cityService.getAllProvince(0, 50).then(res => {
            this.provinces = res;
        });
        this.goForContactValidation();
        this.goForOffAndOn();
    }
    onSelectPublisher(event: any) {
        if (event != undefined) {
            this.cityService.getAllCityByProvinceId(event.id).then((res: CityModel[]) => {
                this.cities = res;
            });
        }
    }

    edit() {
        console.log('this.city::', this.city);
        this.city ? this.publisher.cityId = this.city.id : this.publisher.cityId = null;
        this.publisherService.saveNewPublisher(this.publisher).then(res => {
            if (this.modal == true) {
                this.passEntry.emit(res);
            } else {
                this.router.navigate(['/sources/publisher-list'], {relativeTo: this.route.parent});
            }
            this.toastr.success('اطلاعات ناشر با موفقیت ثبت شد');
        }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

    afterUploadLicenses(event) {
        this.publisher.licenseFileUuid = event;
        this.getImageFromService(event);
    }

    getImageFromService(uuid) {
        this.publisherService.getImage(uuid).subscribe(data => {
            this.createImageFromBlob(data);
        }, error => {
            console.log(error);
        });
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.imageToShowLicense = reader.result;
            this.isImageLoading = true;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    createContact() {
        this.publisher.contacts.push({content: this.contact.content, type: this.contact.type})
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
                this.publisher.contacts.splice(id, 1);
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
