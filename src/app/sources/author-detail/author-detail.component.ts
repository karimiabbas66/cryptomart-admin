import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorModel} from '../shared/dto/author.model';
import {AuthorService} from '../shared/service/author.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {
    NgbDateStruct, NgbCalendar, NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {ISubscription} from 'rxjs-compat/Subscription';
import swal from "sweetalert2";

@Component({
    selector: 'app-author-detail',
    templateUrl: './author-detail.component.html',
    styleUrls: ['./author-detail.component.scss']
})
export class AuthorDetailComponent implements OnInit {
    public authorDetailForm: FormGroup;
    public authorId: number;
    public author: AuthorModel;
    @Input() public modal: boolean;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    users = [];
    genders = [{id: true, name: 'مرد'}, {id: false, name: 'زن'}];
    model: NgbDateStruct;
    nicknames: any[] = [];
    deathDatePlaceholder: string = 'تاریخ وفات';
    birthDatePlaceholder: string = 'تاریخ تولد';
    fromProfile: boolean = false;
    private _unSubscription: ISubscription;
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
                private modalService: NgbModal,
                private toastr: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private calendar: NgbCalendar,
                private authorService: AuthorService) {
    }
    ngOnInit() {
        this.contact = {};
        this.route.queryParams.subscribe(params => {
            this.authorId = params['id'];
            if (this.authorId) {
                this.authorService.getAuthorModel(this.authorId).then((res: AuthorModel) => {
                    this.author = res;
                    this.nicknames = res.authorNicknames;
                    if (!res.authorNicknames) {
                        this.author.authorNicknames = [];
                    }
                    if (res.profileId) {
                        this.fromProfile = true;
                    }
                    if (!this.author.dateType) {
                        this.author.dateType = 0;
                    }
                })
            } else {
                this.author = {dateType: 0, authorNicknames: [], contacts: []}
            }
        this.authorDetailForm = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl(1, [Validators.required]),
            dateType: new FormControl(''),
            gender: new FormControl(''),
            confirmed: new FormControl(''),
            birthDate: new FormControl(''),
            deathDate: new FormControl(''),
            keyword: '',
        });
        })

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
        this.goForContactValidation();
        this.goForOffAndOn();

    }

    onBirthDateChange(data) {
        console.log("in component: ", data)
        this.author.birthDate = data;
    }
    onDeathDateChange(data) {
        this.author.deathDate = data;
    }

    edit() {
        console.log("author::", this.author);
        if (this.nicknames && this.nicknames.length > 0) {
            this.nicknames.forEach(nick=>{
                this.author.authorNicknames.push(nick.display)
            });
        }
        this.authorService.saveNewAuthor(this.author).then((res: AuthorModel) => {
            if (this.modal == true) {
                this.passEntry.emit(res);
            } else {
                this.router.navigate(['/sources/author-list'], { relativeTo: this.route.parent });
            }
            this.toastr.success('اطلاعات پدید آورنده با موفقیت ثبت شد');
        }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

    addCustomUser = (term) => (term);

    getProfile(final: any) {
        this.author.firstName = final[0].firstName;
        this.author.lastName = final[0].lastName;
        this.author.profileId = final[0].id;
        this.author.gender = final[0].gender;
        this.author.birthDate = final[0].birthDate;
        this.fromProfile = true;
        this.authorDetailForm.controls['gender'].disable({emitEvent: true});
    }


    createContact() {
        this.author.contacts.push({content: this.contact.content, type: this.contact.type})
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
                this.author.contacts.splice(id, 1);
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
