import {Component, OnInit} from '@angular/core';
import {BulkRegistrationRequestMetaDataDto} from './dto/BulkRegistrationRequestMetaDataDto';
import {BulkRegistrationService} from '../bulk-registration/bulk-registration.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-bulk-registration-report-list',
    templateUrl: './bulk-registration-report-list.component.html',
    styleUrls: ['./bulk-registration-report-list.component.scss']
})
export class BulkRegistrationReportListComponent implements OnInit {
    showProgress = false;
    data: BulkRegistrationRequestMetaDataDto[] = [];
    totalRecords: any;
    pageSize= 5;

    constructor(private bulkRegistrationService: BulkRegistrationService,
                private router: Router) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadRequests(pageNumber: number) {
        this.showProgress = true;
        this.bulkRegistrationService.loadAllRequests(pageNumber - 1, this.pageSize).then(value => {
            this.data = value;
            this.showProgress = false;
        }).catch(err => {
            this.showProgress = false;
        });
    }

    private loadData() {
        this.showProgress = true;
        this.bulkRegistrationService.countAllRequests().then((value: number) => {
            this.totalRecords = value;
            this.bulkRegistrationService.loadAllRequests(0, this.pageSize).then(res => {
                this.data = res;
                this.showProgress = false;
            }).catch(err => {
                this.showProgress = false;
            })
        }).catch(err => {
            this.showProgress = false;
        })
    }

    goTarget(item: BulkRegistrationRequestMetaDataDto) {
        this.router.navigate(['/profile/bulk-registration-report-detail'], {queryParams: {id: item.id}});
    }
}
