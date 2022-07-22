import {Component, OnInit, ViewChild} from '@angular/core';
import {Logo} from '../shared/dto/Logo';
import {ContentService} from '../shared/service/content.service';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-logo-list',
    templateUrl: './logo-list.component.html',
    styleUrls: ['./logo-list.component.scss']
})
export class LogoListComponent implements OnInit {

    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    showProgress = false;
    data: Logo[];
    totalRecords: number;
    pageSize: number = 5;

    constructor(private contentService: ContentService,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.contentService.countAllLogos().then((value:number) => {
            this.totalRecords = value;
            this.contentService.loadAllLogos(0,  this.pageSize).then(res=>{
                this.data = res;
                this.showProgress=false;
            }).catch(err=>{
                this.showProgress=false;
            })
        }).catch(err=>{
            this.showProgress=false;
        })
    }

    removelogo(logoId: number) {
        swal.fire({
            title: 'آیا از حذف لوگو اطمینان دارید؟',
            text: "!شما قادر به برگرداندن مورد حذف شده نخواهید بود",
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            if (result.value) {
                this.contentService.removeLogo(logoId).then(res=>{
                    this.contentService.countAllLogos().then((value:number) => {
                        this.totalRecords = value;
                        this.ngbPagination.page=1
                        this.contentService.loadAllLogos(0,  this.pageSize).then(res=>{
                            this.data = res;
                            let setting:SweetAlertOptions={};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.بنر انتخاب شده حذف شد';
                            setting.type = 'success';
                            swal.fire(
                                setting
                            )
                        })
                    })
                }).catch(err => {
                    this.toastr.error(err.error.message);
                });
            }
        })
    }

    loadLogos(pageNumber: number) {
        this.showProgress = true;
        this.contentService.loadAllLogos(pageNumber - 1, this.pageSize).then(value => {
            this.data = value;
            this.showProgress = false;
        }).catch(err => {
            this.showProgress = false;
        });
    }
}
