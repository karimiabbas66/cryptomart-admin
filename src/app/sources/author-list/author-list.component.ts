import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthorModel} from '../shared/dto/author.model';
import {AuthorService} from '../shared/service/author.service';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent implements OnInit {
  authorList: AuthorModel[];

  totalRecords: number;

  loading: boolean;

  filterName:string='';

  tableSize: number = 5;

  constructor(private authorService: AuthorService,
              private toastr: ToastrService,
              private change: ChangeDetectorRef,
              private router:Router) {
  }

  ngOnInit(): void {
    this.authorService.getAllAuthorCount().then((value: number) => {
      // alert('error::' + JSON.stringify(value))
      this.totalRecords = value;
    }).catch(error=> {
      // alert('error::' + JSON.stringify(error))
    })
    this.getAuthorList(1);
  }

  onchange(event) {
    this.filterName = event.target.value;
    this.getAuthorList(1);
  }

  getAuthorList(pageNumber) {
    this.loading = true;
    const page: number = +pageNumber;
    this.authorService.getAllAuthor(page - 1, this.tableSize, this.filterName)
        .then((res: AuthorModel[]) => {
          this.loading = false;
          this.authorList = res;
          this.change.detectChanges();
        }).catch(error => {
      this.loading = false;
      this.toastr.error(error.error.message);
    })

  }

  removeAuthor(authorId: number) {
    swal.fire({
      title: 'آیا از حذف پدید آورنده اطمینان دارید؟',
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
        this.authorService.removeAuthor(authorId).then(res=>{
          this.authorService.getAllAuthorCount().then((value:number) => {
            this.totalRecords = value;
            this.authorService.getAllAuthor(0,  this.tableSize, null).then(res=>{
              this.authorList = res;
              let setting:SweetAlertOptions={};
              setting.confirmButtonText = 'بستن';
              setting.title = '!حدف شد';
              setting.animation = true;
              setting.text = '.پدید آورنده انتخاب شده حذف شد';
              setting.type = 'success';
              swal.fire(
                  setting
              )
            })
          })
        }).catch((err: any) => {
          console.log("err::", err)
          if (err.error.responseCode === 90000002) {
            this.toastr.error("از این پدید آورنده در منابع استفاده شده است. لطفا ابتدا پدید آورنده را در منابع عوض کنید");
          } else {
            this.toastr.error(err.error.message);
          }
        });
      }
    })
  }

}
