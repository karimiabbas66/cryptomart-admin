import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PersonalService} from './personal.service';
import {Personal} from '../shared/dto/Personal';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs-compat/Subscription';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {PersianCalendarService} from '../../shared/services/persian-calendar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../../shared/file-manager.service';
import {observable, Observable, Observer} from 'rxjs';
import {AppSettings} from '../../pages/shared/AppSettings';


export class Access {
    id?: number;
    isUser?: boolean;
    isAdmin?: boolean;
}

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit, OnDestroy {

    @Input() profileId: string;

    public person: Personal = {};
    public access: Access = {};
    public contact: { type?: string, content?: string };
    public birthDate: string = '';
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    public contentTypeSelect = Array(
        {name: 'موبایل', value: 'MOBILE', avatar: '../../assets/img/color/007bff.png'},
        {name: 'تلفن', value: 'PHONE', avatar: '../../assets/img/color/FF8D60.png'},
        {name: 'ایمیل', value: 'EMAIL', avatar: '../../assets/img/color/20c997.png'},
    )
    personalForm: FormGroup;
    contactForm: FormGroup;
    private unsubscribe: ISubscription;
    on = true;


    constructor(private service: PersonalService,
                private modalService: NgbModal,
                private toa: ToastrService,
                private fileManagerService: FileManagerService,
                private builder: FormBuilder,
                private persianCalendarService: PersianCalendarService) {

    }

    ngOnInit() {

        this.personalForm = this.builder.group({
            firstName: new FormControl(null),
            lastName: new FormControl(null),
            nationalCode: new FormControl(null),
            mainPhone: new FormControl(null),
            address: new FormControl(null),
            gender: new FormControl(1, [Validators.required]),
            birthDate: new FormControl(null),
            marital: new FormControl(null),
        })

        this.goForOffAndOn();
        this.contact = {};
        this.service.getPersonalInformation(this.profileId).then(data => {
            this.person = data;
            this.birthDate = this.persianCalendarService.convertEpochToJalaliString(this.person.birthDate);
        });
        this.service.getAccess(this.profileId).then(data => {
            console.log(data)
            this.access = data;
        });

        this.contactForm = this.builder.group({
            contactType: new FormControl(null, [Validators.required]),
            content: new FormControl(null, [Validators.required]),

        })

        this.unsubscribe = this.contactForm.get('contactType')
            .valueChanges.subscribe(data => {
                if (data) {
                    this.contact.type = data.value;
                }
            })

        this.unsubscribe = this.contactForm.get('content')
            .valueChanges.subscribe(data => {
                if(data){
                    this.contact.content = data;
                }
            })
        this.goForContactValidation();
    }

    submitPersonalForm() {
        this.person.birthDate = this.persianCalendarService.convertJalaliStringToEpoch(this.birthDate);
        console.log(this.access)
        this.service.updateAccess(this.access).then(result => {
            this.service.getAccess(this.profileId).then(data => {
                this.access = data;
                this.service.updatePersonalInformation(this.person).then(result => {
                    this.service.getPersonalInformation(this.profileId).then(data => {
                        this.person = data;
                        let setting: SweetAlertOptions = {};
                        setting.confirmButtonText = 'بستن';
                        setting.title = 'انجام شد';
                        setting.animation = true;
                        setting.text = 'بروزرسانی اطلاعات انجام شد';
                        setting.type = 'success';
                        swal.fire(setting);
                    }).catch(err => {
                        this.toa.error(err.error.message)
                    })
                }).catch(err => {
                    this.toa.error(err.error.message)
                });
            }).catch(err => {
                this.toa.error(err.error.message)
            })
        }).catch(err => {
            this.toa.error(err.error.message)
        })
        this.service.getAccess(this.profileId).then(data => {
            this.access = data;
        })


        this.unsubscribe = this.contactForm.get('contactType')
            .valueChanges.subscribe(data => {
                if (data) {
                    this.contact.type = data.value;
                }
            })

        this.unsubscribe = this.contactForm.get('content')
            .valueChanges.subscribe(data => {
                if(data){
                    this.contact.content = data;
                }
            })
    }

    editMainContact(content) {
        this.service.updateMainPhone(this.profileId, content).then(result => {
            this.service.getPersonalInformation(this.profileId).then(data => {
                this.person = data;
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'انجام شد';
                setting.animation = true;
                setting.text = 'بروزرسانی اطلاعات انجام شد';
                setting.type = 'success';
                swal.fire(setting);
            }).catch(err => {
                this.toa.error(err.error.message)
            })
        }).catch(err => {
            this.toa.error(err.error.message)
        })

    }

    createContact() {
        this.service.addContact(this.person.id, this.contact).then(result => {
            this.service.getPersonalInformation(this.profileId).then(data => {
                this.person = data;
                this.contactForm.get('contactType').reset();
                this.contactForm.get('content').reset();
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'انجام شد';
                setting.animation = true;
                setting.text = 'بروزرسانی اطلاعات تماس انجام شد';
                setting.type = 'success';
                swal.fire(setting);
            }).catch(err => {
                this.toa.error(err.error.message)
            })
        }).catch(err => {
            this.toa.error(err.error.message)
        });
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
                this.service.deleteContact(id).then(result => {
                    this.service.getPersonalInformation(this.person.id).then(data => {
                        this.person = data;
                        let setting: SweetAlertOptions = {};
                        setting.confirmButtonText = 'بستن';
                        setting.title = 'حذف شد';
                        setting.animation = true;
                        setting.text = '.حذف اطلاعات تماس با موفقیت انجام شد';
                        setting.type = 'success';
                        swal.fire(setting);
                    })
                })
            }
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe();
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

    private goForOffAndOn() {
        setTimeout(() => {
            this.on = !this.on;
            this.goForOffAndOn();
        }, 500);
    }

    openChangeImageDialog(content) {
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {

        }, (reason) => {
            this.modalService.dismissAll();
        });

    }

    setProfileImage(event) {
        this.fileManagerService.saveBASE64File(event).then(res => {
            this.person.photo = res;
        }).catch(err => {
            this.toa.error(err.error.message)
        })
    }



    removeProfileImage() {
        this.person.photo=null;
    }
}
