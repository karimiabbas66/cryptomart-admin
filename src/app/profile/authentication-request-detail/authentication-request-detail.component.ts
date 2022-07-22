import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppSettings} from '../../pages/shared/AppSettings';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationRequestDto} from '../authentication-request/share/model/AuthenticationRequestDto';
import {FileManagerService} from '../../shared/file-manager.service';
import {AuthenticationRequestService} from '../authentication-request/share/service/AuthenticationRequest.service';
import {Personal} from '../shared/dto/Personal';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {saveAs} from 'file-saver';
import {PersonalService} from '../personal/personal.service';

@Component({
    selector: 'app-authentication-request-detail',
    templateUrl: './authentication-request-detail.component.html',
    styleUrls: ['./authentication-request-detail.component.scss']
})
export class AuthenticationRequestDetailComponent implements OnInit, OnDestroy {

    forShow: { fileId?: string, title?: string }[] = [];
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    subs = new Subscription();
    reqId: any;
    selectedReq: AuthenticationRequestDto = {files: []};
    selectedAdmin: Personal = {};
    selectedUser: Personal = {};
    selectedForShow: string;

    constructor(private route: ActivatedRoute,
                private modalService: NgbModal,
                private fileManagerService: FileManagerService,
                private toa: ToastrService,
                private router: Router,
                private personalService: PersonalService,
                private authService: AuthenticationRequestService) {
    }

    ngOnInit() {
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.reqId = params['id'];
            this.authService.findById(this.reqId).then(res => {
                this.selectedReq = res;
                this.selectedReq.files.forEach(item => {
                    this.fileManagerService.findByUUID(item).then(res5 => {
                        this.forShow.push({fileId: item, title: res5.fileName})
                    })
                })
                this.personalService.getPersonalInformation(this.selectedReq.personalId).then(res1 => {
                    this.selectedUser = res1;
                })
                if (this.selectedReq.changeStatusBy) {
                    this.personalService.getPersonalInformation(this.selectedReq.changeStatusBy).then(res2 => {
                        this.selectedAdmin = res2;
                    })
                }

            })
        }))
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    goForSave() {

        if (this.selectedReq.status == null) {
            this.toa.error('لطفا درخواست را تایید و یا رد نمایید')
        } else if (this.selectedReq && this.selectedReq.status == false && this.selectedReq.description == null) {
            this.toa.error('لطفا توضیح رد کردن درخواست را وارد نمایید')
        } else {
            this.authService.changeStatus(this.selectedReq).then(res => {
                this.toa.success('ثبت شد')
                this.router.navigate(['/profile/authentication-request-list']);
            }, err => {
                this.toa.error(err.error.message)
            })
        }
    }

    showImage(fileId: string, content: any) {
        this.selectedForShow = fileId;
        this.modalService.open(content, {size: 'lg'});
    }

    goForDownload(fileId: string) {
        this.fileManagerService.findByUUID(fileId).then(res1 => {
            this.fileManagerService.getImage(fileId).subscribe(res => {
                saveAs(res, res1.fileName)
            })
        })
    }
}
