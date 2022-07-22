import {Component, OnInit} from '@angular/core';
import {MagazineNumberModel} from '../../../shared/dto/magazine-number.model';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MagazineService} from '../../../shared/service/magazine.service';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
    selector: 'app-magazine-number-list',
    templateUrl: './magazine-number-list.component.html',
    styleUrls: ['./magazine-number-list.component.scss']
})
export class MagazineNumberListComponent implements OnInit {
    magazineId: number;
    magazineNumbers: MagazineNumberModel[] = [];
    tableSize: number = 5;
    totalNumbers: number;
    showProgress: boolean;

    constructor(private magazineService: MagazineService,
                private route: ActivatedRoute,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.route.queryParams.subscribe(param => {
            this.magazineId = param['magazineId'];
            if (this.magazineId) {
                this.magazineService.getMagazineNumbersCount(this.magazineId).then((result: number) => {
                    this.totalNumbers = result;
                }).catch(error => {
                    return error;
                });
                this.getAllNumberForMagazine(0)
            }
        });

    }

    getAllNumberForMagazine(pageSize) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.magazineService.getMagazineNumbersByMagazineId(this.magazineId, page, this.tableSize).then((result: MagazineNumberModel[]) => {
            this.magazineNumbers = result;
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
            this.toastr.error(error.error.message);
        })
    }

    removeMagazineNumber(id: number) {
        swal.fire({
            title: 'آیا از حذف شماره برای مجله مورد نظر اطمینان دارید؟',
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
                this.magazineService.removeMagazineNumber(id).then(res => {
                    this.magazineService.getMagazineNumbersCount(this.magazineId).then((count: number) => {
                        this.totalNumbers = count;
                        this.magazineService.getMagazineNumbersByMagazineId(this.magazineId, 0, this.tableSize).then((list: MagazineNumberModel[]) => {
                            this.magazineNumbers = list;
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = ' .شماره انتخاب شده حذف شد';
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
