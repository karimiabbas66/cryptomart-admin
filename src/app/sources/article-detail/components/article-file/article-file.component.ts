import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthorService} from '../../../shared/service/author.service';
import {ToastrService} from 'ngx-toastr';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload/ng2-file-upload';
let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';

@Component({
  selector: 'app-article-file',
  templateUrl: './article-file.component.html',
  styleUrls: ['./article-file.component.scss']
})
export class ArticleFileComponent implements OnInit {

  public formGroup: FormGroup;
  uploader: FileUploader;
  isDropOver: boolean;
  placeholder: string = 'لطفا فایل کتاب را انتخاب و بارگذاری کنید';

  authorsCount: number;
  loading: boolean = false;
  test: any;
  selectedType: string = 'word';
  @Output()
  fileEmitter: EventEmitter<any> = new EventEmitter<any>();
  disableButton: boolean = true;
  fileTypes = [
    {name: 'pdf'},
    {name: 'word'}
  ];
  fileUuid: string;
  @Input() public file: { fileType?: string; fileUuid?: string, fileConfirmed?: boolean } = {};
  warning: string;
  confirmed: boolean;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private modalService: NgbModal,
              private authorService: AuthorService) {

  }

  ngOnInit() {
    // this.authorForm.get('authors').reset();
    this.formGroup = this.formBuilder.group({
      fileType: new FormControl('', [Validators.required]),
    });

    this.authorService.getAllAuthorCount().then((value: number) => {
      this.authorsCount = value;
    });
    console.log("this.file:::", this.file);
    if (this.file.fileUuid != null) {
      console.log("this.file != null:::", this.file);
      this.warning = 'در صوورتی که نمی خواهید فایل جدید برای کتاب بارگذاری کنید روی دکمه ثبت کلیک کنید';
      this.fileUuid = this.file. fileUuid;
      this.selectedType = this.file.fileType;
      this.confirmed = this.file.fileConfirmed;
    }
  }

  addFile() {
    this.fileEmitter.emit({fileUuid: this.fileUuid,fileType: this.selectedType, fileConfirmed: this.confirmed})
  }

    afterUploadBookFile(event) {
        this.fileUuid = event;
        this.disableButton = false;
    }
}

