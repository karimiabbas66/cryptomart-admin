import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ThesisService} from '../shared/service/thesis.service';
import {ThesisModel} from '../shared/dto/thesis.model';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {JournalModel} from '../shared/dto/journal.model';

@Component({
    selector: 'app-thesis-list',
    templateUrl: './thesis-list.component.html',
    styleUrls: ['./thesis-list.component.scss']
})
export class ThesisListComponent implements OnInit {

    showProgress: boolean = false;
    tableSize: number = 5;
    thesisModel: ThesisModel[] = [];
    totalSize: number;

    constructor(private thesisService: ThesisService,
                private change: ChangeDetectorRef,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.thesisService.getThesisCount().then((count: number) => {
            this.totalSize = count;
            this.showProgress = false;
        }).catch(error => {
            return error;
        });
        this.getAllThesis(0);
    }

    getAllThesis(pageSize) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.thesisService.getAllThesis(page, this.tableSize).then((result: ThesisModel[]) => {
            this.showProgress = false;
            this.thesisModel = result;
            if (this.thesisModel) {
                this.thesisModel.forEach(thesis => {
                    switch (thesis.levelId) {
                        case 1:
                            thesis.levelTitle = 'کارشناسی';
                            break;
                        case 2:
                            thesis.levelTitle = 'کارشناسی ارشد';
                            break;
                        case 3:
                            thesis.levelTitle = 'دکتري حرفه اي';
                            break;
                        case 4:
                            thesis.levelTitle = 'phd دکتري تحصصی';
                            break;
                        case 5:
                            thesis.levelTitle = 'سطح 3 حوزه علمیه';
                            break;
                        case 6:
                            thesis.levelTitle = 'سطح 4 حوزه علمیه';
                            break;
                    }
                });
            }
            this.change.detectChanges();

        }).catch(error => {
            this.toastr.error(error.error.errorMessage)
        });
    }

    removeThesis(id: number) {
        swal.fire({
            title: 'آیا از حذف پایان نامه اطمینان دارید؟',
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
                this.thesisService.removeThesis(id).then(res => {
                    this.thesisService.getThesisCount().then((count: number) => {
                        this.totalSize = count;
                        this.thesisService.getAllThesis(0, this.tableSize).then((resullt: JournalModel[]) => {
                            this.thesisModel = resullt;
                            if (this.thesisModel) {
                                this.thesisModel.forEach(thesis => {
                                    switch (thesis.levelId) {
                                        case 1:
                                            thesis.levelTitle = 'کارشناسی';
                                            break;
                                        case 2:
                                            thesis.levelTitle = 'کارشناسی ارشد';
                                            break;
                                        case 3:
                                            thesis.levelTitle = 'دکتري حرفه اي';
                                            break;
                                        case 4:
                                            thesis.levelTitle = 'phd دکتري تحصصی';
                                            break;
                                        case 5:
                                            thesis.levelTitle = 'سطح 3 حوزه علمیه';
                                            break;
                                        case 6:
                                            thesis.levelTitle = 'سطح 4 حوزه علمیه';
                                            break;
                                    }
                                });
                            }let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.پایان نامه انتخاب شده حذف شد';
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
