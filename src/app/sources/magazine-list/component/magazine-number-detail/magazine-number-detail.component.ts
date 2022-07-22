import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MagazineNumberModel} from '../../../shared/dto/magazine-number.model';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../../../../shared/file-manager.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {MagazineService} from '../../../shared/service/magazine.service';

@Component({
    selector: 'app-magazine-number-detail',
    templateUrl: './magazine-number-detail.component.html',
    styleUrls: ['./magazine-number-detail.component.scss']
})
export class MagazineNumberDetailComponent implements OnInit {
    magazineNumberForm: FormGroup;
    magazineNumberModel: MagazineNumberModel = {};
    magazineResourceId: number;
    magazineNumberId: number;
    type: any;

    uploadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    constructor(private ngbModal: NgbModal,
                private fileManagerService: FileManagerService,
                private toast: ToastrService,
                private route: ActivatedRoute,
                private magazineService: MagazineService,
                private formBuilder: FormBuilder,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.magazineResourceId = param['magazineResourceId'];
            this.magazineNumberId = param['magazineNumberId'];
            if (this.magazineNumberId) {
                this.magazineService.getMagazineNumberById(this.magazineNumberId).then((result: MagazineNumberModel) => {
                    this.magazineNumberModel = result;
                }).catch(error => {
                    return error;
                });
            }
            this.magazineNumberForm = this.formBuilder.group({
                whichYear: new FormControl('', [Validators.required]),
                dateType: new FormControl('', [Validators.required]),
                numberType: new FormControl('', [Validators.required]),
                yearNumber: new FormControl(''),
                serialNumber: new FormControl(''),
                releaseDate: new FormControl(''),
                pageNumber: new FormControl(''),
                photo: new FormControl(''),
                confirmed: new FormControl(''),
            });
            this.type = [{id: 1, name: 'در سال'}, {id: 2, name: 'پیاپی'}, {id: 3, name: 'هردو'}];
        });

    }

    edit() {
        if (this.magazineNumberModel.date == null) {
            this.toast.error('تاریخ وارد نشده');
        }
        switch (this.magazineNumberModel.numberType) {
            case 1:
                if (this.magazineNumberModel.yearNumber == null) {
                    this.toast.error('شماره در سال را وارد کنید');
                    return;
                }
                break;
            case 2:
                if (this.magazineNumberModel.serialNumber == null) {
                    this.toast.error('شماره پیاپی را وارد کنید');
                    return;
                }
                break;
            case 3:
                if (this.magazineNumberModel.yearNumber == null || this.magazineNumberModel.serialNumber == null) {
                    this.toast.error('شماره پیاپی و شماره در سال را وارد کنید');
                    return;
                }
                break;
        }
        this.magazineNumberModel.magazineResourceId = this.magazineResourceId;
        this.magazineService.saveNewMagazineNumber(this.magazineNumberModel).then(result => {
            this.toast.success('مجله با موفقیت ذخیره شد');
            this.router.navigate(['/sources/magazine-number-list'], {queryParams: {magazineId: this.magazineResourceId}});
        }).catch(error => {
            this.toast.error(error.error.message);
        });

    }

    onDateChange(data) {
        this.magazineNumberModel.date = data;
    }

    removePhoto() {
        this.magazineNumberModel.photo = null;
    }

    openChangeImageDialog(content) {
        this.ngbModal.open(content, {size: 'lg', backdrop: 'static'}).result.then(res => {
        }, reason => {
            this.ngbModal.dismissAll();
        });

    }

    setPhoto(data) {
        this.fileManagerService.saveBASE64File(data).then(result => {
            this.magazineNumberModel.photo = result;
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }

}
