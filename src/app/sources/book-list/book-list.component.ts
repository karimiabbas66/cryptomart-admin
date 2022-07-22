import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OwnerModel} from '../shared/dto/owner.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {BookModel} from '../shared/dto/book.model';
import {BookService} from '../shared/service/book.service';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {BookSearchModel} from '../shared/dto/book-search.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  bookList: BookModel[];
  showProgress: boolean = false;

  totalRecords: number;


  filterName:string='';

  tableSize: number = 5;

  constructor(private bookService: BookService,
              private toastr: ToastrService,
              private change: ChangeDetectorRef,
              private router:Router) {
  }

  ngOnInit(): void {
    this.showProgress=true;
    this.bookService.getAllBookCount().then((value: number) => {
      this.totalRecords = value;
      this.showProgress=false;
    }).catch(error => {
      this.showProgress=false;
    });
    this.getOwnerList(0);
  }

  onchange(event) {
    this.filterName = event.target.value;
    this.getOwnerList(0);
  }

  getOwnerList(pageNumber) {
    this.showProgress=true;
    const page: number = +pageNumber;
    this.bookService.getAllBook(page, this.tableSize)
        .then((res: BookModel[]) => {
          this.showProgress=false;
          this.bookList = res;
          this.change.detectChanges();
        }).catch(error => {
      this.showProgress=false;
      this.toastr.error(error.error.message);
    })

  }

  removeBook(bookId: number) {
    swal.fire({
      title: 'آیا از حذف کتاب اطمینان دارید؟',
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
        this.bookService.removeBook(bookId).then(res=>{
          this.bookService.getAllBookCount().then((value:number) => {
            this.totalRecords = value;
            this.bookService.getAllBook(0,  this.tableSize).then(res=>{
              this.bookList = res;
              let setting:SweetAlertOptions={};
              setting.confirmButtonText = 'بستن';
              setting.title = '!حدف شد';
              setting.animation = true;
              setting.text = '.کتاب انتخاب شده حذف شد';
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
