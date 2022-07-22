import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {PublisherModel} from '../shared/dto/publisher.model';
import {PublisherService} from '../shared/service/publisher.service';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss']
})
export class PublisherListComponent implements OnInit {
  publisherList: PublisherModel[];

  totalRecords: number;

  loading: boolean;

  filterName:string='';

  tableSize: number = 5;

  constructor(private publisherService: PublisherService,
              private toastr: ToastrService,
              private change: ChangeDetectorRef,
              private router:Router) {
  }

  ngOnInit(): void {
    this.publisherService.getAllPublisherCount().then((value: number) => {
      this.totalRecords = value;
    })
    this.getPublisherList(1);
  }

  onchange(event) {
    this.filterName = event.target.value;
    this.getPublisherList(1);
  }

  getPublisherList(pageNumber) {
    this.loading = true;
    const page: number = +pageNumber;
    this.publisherService.getAllPublisher(page - 1, this.tableSize, null)
        .then((res: PublisherModel[]) => {
          this.loading = false;
          this.publisherList = res;
          this.change.detectChanges();
        }).catch(error => {
      this.loading = false;
      this.toastr.error(error.error.message);
    })

  }

  removePublisher(authorId: number) {
    swal.fire({
      title: 'آیا از حذف ناشر اطمینان دارید؟',
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
        this.publisherService.removePublisher(authorId).then(res=>{
          this.publisherService.getAllPublisherCount().then((value:number) => {
            this.totalRecords = value;
            this.publisherService.getAllPublisher(0,  this.tableSize, null).then(res=>{
              this.publisherList = res;
              let setting:SweetAlertOptions={};
              setting.confirmButtonText = 'بستن';
              setting.title = '!حدف شد';
              setting.animation = true;
              setting.text = '.ناشر انتخاب شده حذف شد';
              setting.type = 'success';
              swal.fire(
                  setting
              )
            })
          })
        }).catch(err => {
          console.log("err::", err)
          if (err.error.responseCode === 90000002) {
            this.toastr.error("از این ناشر در منابع استفاده شده است. لطفا ابتدا ناشر را در منابع عوض کنید");
          } else {
            this.toastr.error(err.error.message);
          }
        });
      }
    })
  }

}
