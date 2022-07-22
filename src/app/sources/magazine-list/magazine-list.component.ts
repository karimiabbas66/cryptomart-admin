import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MagazineModel} from '../shared/dto/magazine.model';
import {MagazineService} from '../shared/service/magazine.service';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {JournalModel} from '../shared/dto/journal.model';

@Component({
    selector: 'app-magazine-list',
    templateUrl: './magazine-list.component.html',
    styleUrls: ['./magazine-list.component.scss']
})
export class MagazineListComponent implements OnInit {
    magazineList: MagazineModel[] = [];
    showProgress: boolean;
    totalRecord: number;
    tableSize: number = 5;

    constructor(private magazineService: MagazineService,
                private change: ChangeDetectorRef,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.magazineService.getAllMagazineCount().then((result: number) => {
            this.totalRecord = result;
            this.showProgress = false;
        }).catch(error => {
            return error;
        });
        this.getMagazineList(0);
    }

    getMagazineList(pageSize) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.magazineService.getAllMagazine(page, this.tableSize).then((result: MagazineModel[]) => {
            this.magazineList = result;
            if (this.magazineList.length > 0) {
                this.magazineList.forEach(magazine => {
                    if (magazine.releaseType) {
                        switch (magazine.releaseType) {
                            case 1:
                                magazine.releaseTypeName = 'الکترونیکی';
                                magazine.releaseTypeName = 'عمومی';
                                break;
                            case 2:
                                magazine.releaseTypeName = 'چاپی';
                                magazine.releaseTypeName = 'تخصصی';
                                break;
                            case 3:
                                magazine.releaseTypeName = 'چاپی-الکترونیکی';
                        }
                    }
                });
            }
            this.change.detectChanges();
        }).catch(error => {
            this.showProgress = false;
            this.toast.error(error.error.errorMessage)
        });
    }

    removeMagazine(id: number) {
        swal.fire({
            title: 'آیا از حذف مجله اطمینان دارید؟',
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
                this.magazineService.removeMagazine(id).then(res => {
                    this.magazineService.getAllMagazineCount().then((count: number) => {
                        this.totalRecord = count;
                        this.magazineService.getAllMagazine(0, this.tableSize).then((list: JournalModel[]) => {
                            this.magazineList = list;
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.مجله انتخاب شده حذف شد';
                            setting.type = 'success';
                            swal.fire(setting)
                        });
                    });
                }).catch(error => {
                    this.toast.error(error.error.message);
                });
            }
        });

    }

}
