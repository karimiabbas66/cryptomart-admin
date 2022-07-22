import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import {OwnerModel} from '../shared/dto/owner.model';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {BookModel} from '../shared/dto/book.model';
import {BookService} from '../shared/service/book.service';
import {AuthorModel} from '../shared/dto/author.model';
import {WizardComponent, WizardState} from 'angular-archwizard';
import {PublisherModel} from '../shared/dto/publisher.model';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  public bookId: number;
  public book: BookModel = {};
  authors: AuthorModel[] = [];
  owners: OwnerModel[] = [];
  publishers: PublisherModel;
  loading: boolean = false;
  test: any;
  showProgress: boolean = false;

  @ViewChild(WizardComponent, {static: false})
  public wizard: WizardComponent;
  file: { fileType?: string; fileUuid?: string , fileConfirmed?: boolean} = {};
  step: number = 1;
  allOwners?: OwnerModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private bookService: BookService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookId = params['bookId'];
      if (this.bookId) {
        this.showProgress=true;
        this.bookService.getBookModel(this.bookId).then((res: BookModel) => {
          this.showProgress=false;
          this.book = res;
          this.file = {fileType: res.fileType, fileUuid: res.fileUuid, fileConfirmed: res.fileConfirmed};
        }).catch(error => {
          this.showProgress=false;
        })
      }
    });

  }

  onBookInfo(data: any) {
    this.step = 2;
    this.book = data;
    this.wizard.model.navigationMode.goToNextStep();
  }

  onAuthorInfo(data: any) {
    this.step = 3;
    this.authors = data;
    this.book.authors = data;
    this.book.authorConfirmed = data[0].confirmed;
    this.wizard.model.navigationMode.goToNextStep();
    this.allOwners = data.map(pub => ({fullName: pub.fullName, authorId: pub.authorId, ownerType: 0}));
    this.allOwners = this.allOwners.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.ownerId === thing.ownerId
        ))
    );
  }

  onPublisherInfo(data: PublisherModel) {
    this.step = 4;
    this.publishers = data;
    this.book.publisher = data;
    this.book.isbn = data.isbn;
    this.book.publishedNumber = data.publishedNumber;
    this.book.resourceTypeId = data.resourceTypeId;
    this.book.publisherConfirmed = data.confirmed;
    this.wizard.model.navigationMode.goToNextStep();
    console.log("this.book.authors::", this.book.authors);
    // this.allOwners = this.allOwners.filter((thing, index, self) =>
    //     index === self.findIndex((t) => (
    //         t.publisherId === thing.publisherId
    //     ))
    // );
    // this.allOwners = data.map(pub => ({fullName: pub.publisherName, publisherId: pub.publisherId, ownerType: 1}));

    this.allOwners.push({fullName: data.publisherName, publisherId: data.publisherId, ownerType: 1});
    // auths.forEach(own => {
    //   own.ownerType = 0;
    //   this.allOwners.push(own)
    // });
    console.log("this.allOwners::", this.allOwners);

  }

  onOwnerInfo(data: any) {
    this.step = 5;
    this.owners = data;
    this.book.ownerConfirmed = data[0].confirmed;
    this.wizard.model.navigationMode.goToNextStep();
    this.book.owners = data;
    console.log('this.book:  ',this.book);
  }

  onFileInfo(data: any) {
    this.book.fileUuid = data.fileUuid;
    this.book.fileType = data.fileType;
    this.book.fileConfirmed = data.fileConfirmed;
    this.bookService.saveNewBook(this.book)
        .then(res => {
          this.toastr.success('کتاب با موفقیت ذخیره شد');
          this.router.navigate(['/sources/book-list'], { relativeTo: this.route.parent });
        }).catch(ex => {
      this.toastr.error(ex.error.message);
    })

  }
}
