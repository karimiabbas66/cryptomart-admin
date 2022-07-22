import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {StaticPage} from '../shared/dto/StaticPage';
import {ContentService} from '../shared/service/content.service';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
  selector: 'app-static-page-list',
  templateUrl: './static-page-list.component.html',
  styleUrls: ['./static-page-list.component.scss']
})
export class StaticPageListComponent implements OnInit {

  @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
  data: StaticPage[];
  pageSize:number=5;
  selectedField: StaticPage;
  totalRecords: number;

  loading: boolean;
  showProgress=false;
  constructor(private contentService: ContentService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.showProgress=true;
    this.contentService.countAllStaticPages().then((value:number) => {
      this.totalRecords = value;
      this.contentService.loadAllStaticPages(0,  this.pageSize).then(res=>{
        this.data = res;
        this.showProgress=false;
      }).catch(err=>{
        this.showProgress=false;
      })
    }).catch(err=>{
      this.showProgress=false;
    })
  }
  loadStaticPages(pageNumber: number) {
    this.showProgress=true;
    this.contentService.loadAllStaticPages(pageNumber - 1, this.pageSize).then(value => {
      this.data = value;
      this.showProgress=false;
    }).catch(err=>{
      this.showProgress=false;
    });
  }

  removeStaticPage(staticPageId: number) {
    swal.fire({
      title: 'آیا از حذف صفحه اطمینان دارید؟',
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
        this.contentService.removeStaticPage(staticPageId).then(res=>{
          this.contentService.countAllStaticPages().then((value:number) => {
            this.totalRecords = value;
            this.ngbPagination.page=1
            this.contentService.loadAllStaticPages(0,  this.pageSize).then(res=>{
              this.data = res;
              let setting:SweetAlertOptions={};
              setting.confirmButtonText = 'بستن';
              setting.title = '!حدف شد';
              setting.animation = true;
              setting.text = '.صفحه انتخاب شده حذف شد';
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
