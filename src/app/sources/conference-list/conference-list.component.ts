import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ConferenceModel} from '../shared/dto/conference.model';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ConferenceService} from '../shared/service/conference.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-conference-list',
    templateUrl: './conference-list.component.html',
    styleUrls: ['./conference-list.component.scss']
})
export class ConferenceListComponent implements OnInit {

    conferenceList: ConferenceModel[];
    showProgress: boolean;
    totalRecords: number;
    tableSize: number = 5;


    constructor(private conferenceService: ConferenceService,
                private change: ChangeDetectorRef,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.conferenceService.getConferenceCount().then((count: number) => {
            this.totalRecords = count;
            this.showProgress = false;
        }).catch(error => {
            return error;
        });
        this.getConferenceList(0);
    }


    getConferenceList(pageSize) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.conferenceService.getAllConference(page, this.tableSize).then((data: ConferenceModel[]) => {
            this.showProgress = false;
            this.conferenceList = data;
            if (this.conferenceList.length > 0) {
                this.conferenceList.forEach(conference => {
                    conference.conferencePlace = conference.conferenceCityPlace + '(' + conference.conferenceStatePlace + ')';
                });
            }
            this.change.detectChanges();
        }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.errorMessage)
        });
    }

    removeConference(id: number) {
        swal.fire({
            title: 'آیا از حذف کنفرانس اطمینان دارید؟',
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
                this.conferenceService.removeConference(id).then(res => {
                    this.conferenceService.getConferenceCount().then((count: number) => {
                        this.totalRecords = count;
                        this.conferenceService.getAllConference(0, this.tableSize).then((list: ConferenceModel[]) => {
                            this.conferenceList = list;
                            if (this.conferenceList.length > 0) {
                                this.conferenceList.forEach(conference => {
                                    conference.conferencePlace = conference.conferenceCityPlace + '(' + conference.conferenceStatePlace + ')';
                                });
                            }let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.مقاله انتخاب شده حذف شد';
                            setting.type = 'success';
                            swal.fire(setting)
                        });
                    });
                }).catch(error => {
                    this.toastr.error(error.error.message);
                });
            }
        });
    }

    onchange(event) {
        this.getConferenceList(0);
    }

}
