import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {OwnerModel} from '../shared/dto/owner.model';
import {OwnerService} from '../shared/service/owner.service';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.scss']
})
export class OwnerListComponent implements OnInit {
  ownerList: OwnerModel[];

  totalRecords: number;

  loading: boolean;

  filterName:string='';

  tableSize: number = 5;

  constructor(private ownerService: OwnerService,
              private toastr: ToastrService,
              private change: ChangeDetectorRef,
              private router:Router) {
  }

  ngOnInit(): void {
    this.ownerService.getAllOwnerCount().then((value: number) => {
      this.totalRecords = value;
    });
    this.getOwnerList(0);
  }

  onchange(event) {
    this.filterName = event.target.value;
    this.getOwnerList(0);
  }

  getOwnerList(pageNumber) {
    this.loading = true;
    const page: number = +pageNumber;
    this.ownerService.getAllOwner(page, this.tableSize, null)
        .then((res: OwnerModel[]) => {
          this.loading = false;
          this.ownerList = res;
          this.change.detectChanges();
        }).catch(error => {
      this.loading = false;
      this.toastr.error(error.error.message);
    })

  }

  removeOwner(authorId: number) {
    swal.fire({
      title: 'آیا از حذف مالک اطمینان دارید؟',
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
        this.ownerService.removeOwner(authorId).then(res=>{
          this.ownerService.getAllOwnerCount().then((value:number) => {
            this.totalRecords = value;
            this.ownerService.getAllOwner(0,  this.tableSize, null).then(res=>{
              this.ownerList = res;
              let setting:SweetAlertOptions={};
              setting.confirmButtonText = 'بستن';
              setting.title = '!حدف شد';
              setting.animation = true;
              setting.text = '.مالک انتخاب شده حذف شد';
              setting.type = 'success';
              swal.fire(
                  setting
              )
            })
          })
        }).catch(err => {
          console.log("err::", err)
          if (err.error.responseCode === 90000002) {
            this.toastr.error("از این مالک در منابع استفاده شده است. لطفا ابتدا پدید آورنده را در منابع عوض کنید");
          } else {
            this.toastr.error(err.error.message);
          }
        });
      }
    })
  }

}
