import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JournalModel} from '../../../shared/dto/journal.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JournalService} from '../../../shared/service/journal.service';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../../../../shared/file-manager.service';
import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs-compat/Subscription';
import swal from 'sweetalert2';

@Component({
    selector: 'app-journal-info',
    templateUrl: './journal-info.component.html',
    styleUrls: ['./journal-info.component.scss']
})
export class JournalInfoComponent implements OnInit {

    @Input() public journal: JournalModel;
    @Output() journalInfo: EventEmitter<any> = new EventEmitter<any>();
    public journalForm: FormGroup;
    languages: any;
    releaseTypes: any;
    releasePeriods: any;
    uploadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';
    contactForm: FormGroup;
    public contact: { type?: string, content?: string };
    private unsubscribe: ISubscription;
    public contentTypeSelect = Array();

    constructor(private journalService: JournalService,
                private formBuilder: FormBuilder,
                private ngbModal: NgbModal,
                private fileManagerService: FileManagerService,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.contact = {};
        this.journal.contactDtoList = [];
        this.journalForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            languageId: new FormControl('', [Validators.required]),
            releasePeriod: new FormControl('', [Validators.required]),
            startReleaseDate: new FormControl(''),
            releaseType: new FormControl(''),
            printISSN: new FormControl(''),
            electronicISSN: new FormControl(''),
            updateDate: new FormControl(''),
            specialistArea: new FormControl(''),
            aboutJournal: new FormControl(''),
            journalPhoto: new FormControl(''),
            webSite: new FormControl(''),
            address: new FormControl(''),
            confirmed: new FormControl(''),
            description: new FormControl(''),
            hasIcsScore: new FormControl(''),
            eigenfactorScore: new FormControl(''),
            hIndexScore: new FormControl(''),
            otherScoreDescription: new FormControl(''),
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
                if (data) {
                    this.contact.content = data;
                }
            });

        this.contentTypeSelect = [
            {name: 'تلفن', value: 'PHONE', avatar: '../../assets/img/color/FF8D60.png'},
            {name: 'ایمیل', value: 'EMAIL', avatar: '../../assets/img/color/20c997.png'},
            {name: 'تلگراف', value: 'TELEGRAPH', avatar: '../../assets/img/color/007bff.png'},
        ];

        this.languages = [
            {id: 0, name: 'فارسی'}, {id: 1, name: 'انگلیسی'},
            {id: 2, name: 'عربی'}, {id: 3, name: 'سایر'}
        ];

        this.releaseTypes = [{id: 1, name: 'الکترونیکی'}, {id: 2, name: 'چاپی'}, {id: 3, name: 'هردو'}];

        this.releasePeriods = [
            {id: 0, name: 'روزنامه'}, {id: 1, name: 'هفته نامه'}, {id: 2, name: 'دو هفته نامه'},
            {id: 3, name: 'ماهنامه'}, {id: 4, name: 'دو ماه نامه'}, {id: 5, name: 'فصل نامه'}, {id: 6, name: 'دو فصلنامه'},
            {id: 7, name: 'سالنامه'}, {id: 8, name: 'گاهنامه'}, {id: 9, name: 'ویژه نامه'}
        ];
        this.contactValidation();
    }

    edit() {
        this.journalInfo.emit(this.journal);
    }

    setUpdateDate(event: any) {
        this.journal.updateDate = event;
    }

    removeJournalPhoto() {
        this.journal.journalPhoto = null;
    }

    openChangeImageDialog(content) {
        this.ngbModal.open(content, {size: 'lg', backdrop: 'static'}).result.then(res => {
        }, reason => {
            this.ngbModal.dismissAll();
        });
    }

    setJournalPhoto(event) {
        this.fileManagerService.saveBASE64File(event).then(result => {
            this.journal.journalPhoto = result;
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }

    createContact() {
        this.journal.contactDtoList.push({content: this.contact.content, type: this.contact.type});
        this.contactForm.reset()
    }

    private contactValidation() {
        this.contactForm.get('contactType').valueChanges
            .subscribe(type => {
                if (type) {
                    switch (type.value) {
                        case 'EMAIL':
                            this.contactForm.get('content').setValidators([Validators.email]);
                            break;
                        case 'PHONE':
                            this.contactForm.get('content').setValidators([Validators.pattern('^[0][1-9]{1}[0-9]{9}$'), Validators.required]);
                            break;
                        case 'TELEGRAPH':
                            this.contactForm.get('content').setValidators([Validators.pattern('^[0][9]{1}[0-9]{9}$'), Validators.required]);
                            break;
                    }
                }
                this.contactForm.get('content').updateValueAndValidity();
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
                this.journal.contactDtoList.splice(id, 1);
            }
        })
    }

}
