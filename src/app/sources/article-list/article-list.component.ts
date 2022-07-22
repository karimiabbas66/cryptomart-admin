import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ArticleService} from '../shared/service/article.service';
import {ArticleModel} from '../shared/dto/article.model';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  articleList: ArticleModel[] = [];
  totalRecords: number;
  tableSize: number = 5;
  showProgress: boolean = false;

  constructor(private articleService: ArticleService,
              private toastr: ToastrService,
              private change: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this.showProgress=true;
    this.articleService.getAllArticleCount().then((value: number) => {
      this.totalRecords = value;
      this.showProgress=false;
    }).catch(error => {
      this.showProgress=false;
    });
    this.getArticleList(0);
  }

  onchange(event) {
    this.getArticleList(0);
  }

  getArticleList(pageNumber) {
    this.showProgress=true;
    const page: number = +pageNumber;
    this.articleService.getAllArticle(page, this.tableSize)
        .then((res: ArticleModel[]) => {
          this.showProgress=false;
          this.articleList = res;
          this.change.detectChanges();
        }).catch(error => {
      this.showProgress=false;
      this.toastr.error(error.error.message);
    })

  }

  removeArticle(articleId: number) {
    swal.fire({
      title: 'آیا از حذف مقاله اطمینان دارید؟',
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
        this.articleService.removeArticle(articleId).then(res=>{
          this.articleService.getAllArticleCount().then((value:number) => {
            this.totalRecords = value;
            this.articleService.getAllArticle(0,  this.tableSize).then(res=>{
              this.articleList = res;
              let setting:SweetAlertOptions={};
              setting.confirmButtonText = 'بستن';
              setting.title = '!حدف شد';
              setting.animation = true;
              setting.text = '.مقاله انتخاب شده حذف شد';
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
