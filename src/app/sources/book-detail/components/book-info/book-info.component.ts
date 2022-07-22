import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BookModel} from '../../../shared/dto/book.model';
import {SourceTypeModel} from '../../../shared/dto/source-type.model';
import {ToastrService} from 'ngx-toastr';
import {SourceTypeService} from '../../../shared/service/source-type.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BookService} from '../../../shared/service/book.service';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent implements OnInit {

  public bookDetailForm: FormGroup;

  public bookId: number;
  sourceTypes: SourceTypeModel[] = [];
  test: any;
  @Input() public book: BookModel;
  @Output()
  bookInfo: EventEmitter<any> = new EventEmitter<any>();
  languages: any;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private sourceTypeService: SourceTypeService,
              private bookService: BookService) {

  }

  ngOnInit() {

    this.bookDetailForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      subject: new FormControl(''),
      shortTitle: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      collectionTitle: new FormControl(''),
      collectionNumber: new FormControl(''),
      editionNumber: new FormControl(''),
      totalVolumeCount: new FormControl('', [Validators.required]),
      pageCount: new FormControl(''),
      confirmed: new FormControl(''),
      isReference: new FormControl(''),
      volume: new FormControl('', [Validators.required]),
      summary: new FormControl(''),
      isbn: new FormControl(''),
    });
    // this.route.queryParams.subscribe(params => {
    //   this.bookId = params['bookId'];
    //   if (!this.bookId) {
    //     this.book = {};
    //   }
    // });
    // this.showProgress=true;
    // this.sourceTypeService.getAllSourceType(0,10).then(res => {
    //   this.showProgress=false;
    //   this.sourceTypes = res;
    // });
    this.languages = [{id: 0, name: 'فارسی'},{id: 1, name: 'انگلیسی'},{id: 2, name: 'عربی'},{id: 3, name: 'سایر'}]
    if (!this.book || (this.book && this.book.languageId == null)) {
      this.book = {languageId: 0}
    }
  }

  edit() {

    this.bookInfo.emit(this.book);
    // this.bookService.saveNewBook(this.book).then(res => {
    //   this.router.navigate(['/sources/book-list'], { relativeTo: this.route.parent });
    //   this.toastr.success('اطلاعات کاب با موفقیت ثبت شد');
    // }).catch(error => {
    //   this.toastr.error(error.error.message);
    // })
  }

}
