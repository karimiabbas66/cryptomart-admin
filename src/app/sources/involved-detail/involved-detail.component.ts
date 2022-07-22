import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {InvolvedModel} from '../shared/dto/involved.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InvolvedService} from '../shared/service/involved.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {ISubscription} from 'rxjs-compat/Subscription';

@Component({
    selector: 'app-involved-detail',
    templateUrl: './involved-detail.component.html',
    styleUrls: ['./involved-detail.component.scss']
})
export class InvolvedDetailComponent implements OnInit {

    public involvedModel: InvolvedModel = {};
    public involvedForm: FormGroup;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    fromProfile: boolean;
    genders: any[];
    deathDatePlaceholder: string = 'تاریخ وفات';
    birthDatePlaceholder: string = 'تاریخ تولد';
    contactForm: FormGroup;
    public contact: { type?: string, content?: string };
    public contentTypeSelect = Array();
    private unsubscribe: ISubscription;
    on = true;

    constructor(private formBuilder: FormBuilder,
                private involvedService: InvolvedService,
                private toastr: ToastrService,
                private router: Router) {
    }

    ngOnInit() {
        this.contact = {};
        this.involvedForm = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl(1, [Validators.required]),
            dateType: new FormControl(''),
            gender: new FormControl(''),
            confirmed: new FormControl(''),
            birthDate: new FormControl(''),
            deathDate: new FormControl(''),
            keyword: '',
        });

        this.genders = [{id: true, name: 'مرد'}, {id: false, name: 'زن'}];

        this.contentTypeSelect = Array(
            {name: 'موبایل', value: 'MOBILE', avatar: '../../assets/img/color/007bff.png'},
            {name: 'تلفن', value: 'PHONE', avatar: '../../assets/img/color/FF8D60.png'},
            {name: 'ایمیل', value: 'EMAIL', avatar: '../../assets/img/color/20c997.png'},
        );

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
                if (data) {
                    this.contact.content = data;
                }
            });
        this.validationContact();
        this.goForOffAndOn();

    }

    getProfile(final: any) {
        this.involvedModel.firstName = final[0].firstName;
        this.involvedModel.lastName = final[0].lastName;
        this.involvedModel.profileId = final[0].id;
        this.involvedModel.gender = final[0].gender;
        this.involvedModel.birthDate = final[0].birthDate;
        this.fromProfile = true;
        this.involvedForm.controls['gender'].disable({emitEvent: true});
    }

    onBirthDateChange(data) {
        this.involvedModel.birthDate = data;
    }

    onDeathDateChange(data) {
        this.involvedModel.deathDate = data;
    }

    edit() {
        this.involvedService.saveNewInvolved(this.involvedModel).then((res: InvolvedModel) => {
            this.passEntry.emit(res);
            this.toastr.success('اطلاعات دست اندرکار با موفقیت ثبت شد');
        }).catch(error => {
            this.toastr.error(error.error.message);
        })

    }

    createContact() {
        if (!this.involvedModel.contacts) {
            this.involvedModel.contacts = []
        }
        this.involvedModel.contacts.push({content: this.contact.content, type: this.contact.type})
        this.contactForm.reset()
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
                this.involvedModel.contacts.splice(id, 1);
            }
        })
    }

    private validationContact() {
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

}
