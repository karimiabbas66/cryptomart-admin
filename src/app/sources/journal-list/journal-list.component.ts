import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {JournalService} from '../shared/service/journal.service';
import {JournalModel} from '../shared/dto/journal.model';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
    selector: 'app-journal-list',
    templateUrl: './journal-list.component.html',
    styleUrls: ['./journal-list.component.scss']
})
export class JournalListComponent implements OnInit {

    showProgress: boolean = false;
    totalRecord: number;
    tableSize: number = 5;
    journalList: JournalModel[] = [];
    journalId: number;

    constructor(private journalService: JournalService,
                private change: ChangeDetectorRef,
                private toastr: ToastrService,) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.journalService.getAllJournalsCount().then((count: number) => {
            this.totalRecord = count;
            this.showProgress = false;
        }).catch(error => {
            return error;
        });
        this.getJournalList(0);
    }

    onchange(event) {
        this.getJournalList(0);
    }

    getJournalList(pageSize) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.journalService.getAllJournal(page, this.tableSize).then((data: JournalModel[]) => {
            this.showProgress = false;
            this.journalList = data;
            if (this.journalList.length > 0) {
                this.journalList.forEach(journal => {
                    if (journal.releaseType) {
                        switch (journal.releaseType) {
                            case 1:
                                journal.releaseTypeName = 'الکترونیکی';
                                break;
                            case 2:
                                journal.releaseTypeName = 'چاپی';
                                break;
                            case 3:
                                journal.releaseTypeName = 'چاپی-الکترونیکی';
                        }
                    }
                });
            }

            this.change.detectChanges();
        }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.errorMessage)
        });
    }


    removeJournal(id: number) {
        swal.fire({
            title: 'آیا از حذف نشریه اطمینان دارید؟',
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
                this.journalService.removeJournal(id).then(res => {
                    this.journalService.getAllJournalsCount().then((count: number) => {
                        this.totalRecord = count;
                        this.journalService.getAllJournal(0, this.tableSize).then((list: JournalModel[]) => {
                            this.journalList = list;
                            if (this.journalList.length > 0) {
                                this.journalList.forEach(journal => {
                                    if (journal.releaseType) {
                                        switch (journal.releaseType) {
                                            case 1:
                                                journal.releaseTypeName = 'الکترونیکی';
                                                break;
                                            case 2:
                                                journal.releaseTypeName = 'چاپی';
                                                break;
                                            case 3:
                                                journal.releaseTypeName = 'چاپی-الکترونیکی';
                                        }
                                    }
                                });
                            }
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.نشریه انتخاب شده حذف شد';
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
