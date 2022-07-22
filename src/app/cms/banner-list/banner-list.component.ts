import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner} from '../shared/dto/Banner';
import {ContentService} from '../shared/service/content.service';
import {ToastrService} from 'ngx-toastr';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit {

  @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
  data: Banner[];
  temp: String[] = [];
  pageSize:number=5;
  totalRecords: number;

  loading: boolean;
    showProgress=false;

  constructor(private contentService: ContentService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.showProgress=true
    this.temp.push("1");
    this.temp.push("2");
    this.temp.push("3");
    this.contentService.countAllBanners().then((value:number) => {
      this.totalRecords = value;
      this.contentService.loadAllBanners(0,  this.pageSize).then(res=>{
        this.data = res;
        this.showProgress=false;
      }).catch(err=>{
        this.showProgress=false;
      })
    }).catch(err=>{
      this.showProgress=false;
    })
  }

  loadBanners(pageNumber: number) {
    this.showProgress=true;
    this.contentService.loadAllBanners(pageNumber - 1, this.pageSize).then(value => {
      this.data = value;
      this.showProgress=false;
    }).catch(err=>{
      this.showProgress=false;
    });
  }

    removeBanner(bannerId: number) {
    swal.fire({
      title: 'آیا از حذف بنر اطمینان دارید؟',
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
        this.contentService.removeBanner(bannerId).then(res=>{
          this.contentService.countAllBanners().then((value:number) => {
            this.totalRecords = value;
            this.ngbPagination.page=1
            this.contentService.loadAllBanners(0,  this.pageSize).then(res=>{
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
}
