import {Component, OnInit} from '@angular/core';
import {JournalService} from '../../../shared/service/journal.service';
import {JournalModel} from '../../../shared/dto/journal.model';
import {JournalNumberModel} from '../../../shared/dto/journal-number.model';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-journal-number-list',
    templateUrl: './journal-number-list.component.html',
    styleUrls: ['./journal-number-list.component.scss']
})
export class JournalNumberListComponent implements OnInit {

    showProgress: boolean;
    numberType: any;
    journalId: number;
    totalJournalNumber: number;
    journalNumbers: JournalNumberModel[] = [];
    tableSize: number = 5;

    constructor(private journalService: JournalService,
                private route: ActivatedRoute,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.journalId = param['journalId'];
            if (this.journalId) {
                this.showProgress = true;
                this.journalService.getJournalNumbersCount(this.journalId).then((result: number) => {
                    this.totalJournalNumber = result;
                    this.showProgress = false;
                }).catch(error => {
                    return error;
                });
                this.getAllNumberForJournal(0);
            }
        });
    }

    getAllNumberForJournal(pageSize: number) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.journalService.getJournalNumbersByJournalId(this.journalId, page, this.tableSize).then((result: JournalModel[]) => {
            this.journalNumbers = result;
            // if (this.journalNumbers) {
            //     this.journalNumbers.forEach(number => {
            //         number.numberTitle = ' سال ' + number.whichYear + ' شماره ' + number.yearNumber + '(' + number.date + ')';
            //     });
            // }
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.errorMessage)
        });
    }

    removeJournalNumber(id: number) {
        swal.fire({
            title: 'آیا از حذف شماره برای نشریه مورد نظر اطمینان دارید؟',
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
                this.journalService.removeJournalNumber(id).then(res => {
                    this.journalService.getJournalNumbersCount(this.journalId).then((count: number) => {
                        this.totalJournalNumber = count;
                        this.journalService.getJournalNumbersByJournalId(this.journalId, 0, this.tableSize).then((list: JournalNumberModel[]) => {
                            this.journalNumbers = list;
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.شماره انتخاب شده حذف شد';
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


}
