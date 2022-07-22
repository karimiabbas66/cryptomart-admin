import {Component, OnDestroy, OnInit} from '@angular/core';
import {BulkRegistrationRequestMetaDataDto} from '../bulk-registration-report-list/dto/BulkRegistrationRequestMetaDataDto';
import {BulkRegistrationService} from '../bulk-registration/bulk-registration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {BulkRegistrationRequestDetailDto} from '../bulk-registration-report-list/dto/BulkRegistrationRequestDetailDto';
import {PersonalService} from '../personal/personal.service';
import {PersonalInformation} from '../../leader-management/shared/dto/PersonalInformation';
import {AppSettings} from '../../pages/shared/AppSettings';
import {Personal} from '../shared/dto/Personal';

@Component({
    selector: 'app-bulk-registration-report-detail',
    templateUrl: './bulk-registration-report-detail.component.html',
    styleUrls: ['./bulk-registration-report-detail.component.scss']
})
export class BulkRegistrationReportDetailComponent implements OnInit, OnDestroy {

    requestMeta: BulkRegistrationRequestMetaDataDto = {}
    logMeta: BulkRegistrationRequestMetaDataDto = {}
    data: BulkRegistrationRequestDetailDto[] = [];
    subs = new Subscription();
    metaId: string;
    totalRecords: any;
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';
    pageSize = 5;
    fileUUID: string;
    user: Personal = {};

    constructor(private bulkRegistrationService: BulkRegistrationService,
                private router: Router,
                private toastr: ToastrService,
                private personal: PersonalService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.metaId = params['id'];
            this.bulkRegistrationService.findMetaDataById(this.metaId).then(res=>{
                this.logMeta = res;
            })
            this.bulkRegistrationService.getMetaById(this.metaId).then(res => {
                this.requestMeta = res;
                this.personal.getPersonalInformation(this.requestMeta.userId).then(res => {
                    this.user = res;
                })

                this.fileUUID = this.requestMeta.fileUUID;
                this.bulkRegistrationService.countAllRequestsDetailById(this.fileUUID).then(res => {
                    this.totalRecords = res;
                }, err => {
                    this.toastr.error(err.error.message);
                })
                this.bulkRegistrationService.loadAllRequestsDetailById(this.fileUUID, 0, this.pageSize).then(res => {
                    this.data = res;
                })
            }, err => {
                this.toastr.error(err.error.message);
            })
        }))
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    loadDetail(pageNumber: number) {
        this.bulkRegistrationService.loadAllRequestsDetailById(this.fileUUID, pageNumber - 1, this.pageSize).then(value => {
            this.data = value;
        }).catch(err => {
            this.toastr.error(err.error.message);
        });
    }

    goProfileDetail(item: BulkRegistrationRequestDetailDto) {
        if (item.userId) {
            this.router.navigate(['/profile/profile-detail'], {queryParams: {id: item.userId}});
        }
    }
}
