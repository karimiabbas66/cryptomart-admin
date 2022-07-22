import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JournalNumberModel} from '../../../shared/dto/journal-number.model';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../../../../shared/file-manager.service';
import {ToastrService} from 'ngx-toastr';
import {JournalService} from '../../../shared/service/journal.service';

@Component({
    selector: 'app-journal-number-detail',
    templateUrl: './journal-number-detail.component.html',
    styleUrls: ['./journal-number-detail.component.scss']
})
export class JournalNumberDetailComponent implements OnInit {

    journalResourceId: number;
    journalNumberId: number;
    journalNumberForm: FormGroup;
    journalNumberModel: JournalNumberModel = {};
    type: any;
    // inYearTypeNumber: number;
    // serialTypeNumber: number;
    // numberTypeMap = new Map();

    uploadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';


    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private ngbModal: NgbModal,
                private fileManagerService: FileManagerService,
                private toast: ToastrService,
                private journalService: JournalService,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.journalResourceId = param['journalResourceId'];
            this.journalNumberId = param['journalNumberId'];
            if (this.journalNumberId) {
                this.journalService.getJournalNumberById(this.journalNumberId).then((result: JournalNumberModel) => {
                    this.journalNumberModel = result;
                }).catch(error => {
                    return error;
                });
            }
            this.journalNumberForm = this.formBuilder.group({
                whichYear: new FormControl('', [Validators.required]),
                dateType: new FormControl('', [Validators.required]),
                numberType: new FormControl('', [Validators.required]),
                yearNumber: new FormControl(''),   // , [Validators.required]
                serialNumber: new FormControl(''), //, [Validators.required]
                pageNumber: new FormControl(''),
                photo: new FormControl(''),
                releaseDate: new FormControl(''),
                confirmed: new FormControl(''),
            });

            this.type = [
                {
                    id: 1,
                    name: 'در سال' // + '(' + this.journalNumberId != null ? this.journalNumberModel.yearNumber : this.inYearTypeNumber + ')'
                },
                {
                    id: 2,
                    name: 'پیاپی' // + '(' + this.journalNumberId != null ? this.journalNumberModel.serialNumber : this.serialTypeNumber + ')'
                },
                {
                    id: 3,
                    name: 'هردو'
                }
            ];
        });
    }

    onDateChange(data) {
        this.journalNumberModel.date = data;
    }

    removePhoto() {
        this.journalNumberModel.photo = null;
    }

    openChangeImageDialog(content) {
        this.ngbModal.open(content, {size: 'lg', backdrop: 'static'}).result.then(res => {
        }, reason => {
            this.ngbModal.dismissAll();
        });

    }

    setPhoto(data) {
        this.fileManagerService.saveBASE64File(data).then(result => {
            this.journalNumberModel.photo = result;
        }).catch(error => {
            this.toast.error(error.error.message);
        });

    }

    save() {
        if (this.journalNumberModel.date == null) {
            this.toast.error('تاریخ وارد نشده');
        }
        switch (this.journalNumberModel.numberType) {
            case 1:
                if (this.journalNumberModel.yearNumber == null) {
                    this.toast.error('شماره در سال را وارد کنید');
                    return;
                }
                break;
            case 2:
                if (this.journalNumberModel.serialNumber == null) {
                    this.toast.error('شماره پیاپی را وارد کنید');
                    return;
                }
                break;
            case 3:
                if (this.journalNumberModel.yearNumber == null || this.journalNumberModel.serialNumber == null) {
                    this.toast.error('شماره پیاپی و شماره در سال را وارد کنید');
                    return;
                }
                break;
        }
        this.journalNumberModel.journalsResourceId = this.journalResourceId;
        this.journalService.saveNewJournalNumber(this.journalNumberModel).then(result => {
            this.toast.success('نشریه با موفقیت ذخیره شد');
            this.router.navigate(['/sources/journal-number-list'], {queryParams: {journalId: this.journalResourceId}});
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }

}
