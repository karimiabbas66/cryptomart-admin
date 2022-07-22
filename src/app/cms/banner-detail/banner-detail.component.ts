import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContentService} from '../shared/service/content.service';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Banner} from '../shared/dto/Banner';
import {AppSettings} from '../../pages/shared/AppSettings';
import {ToastrService} from 'ngx-toastr';
import {PersianCalendarService} from '../../shared/services/persian-calendar.service';
import {Subscription} from 'rxjs';
import {FileManagerService} from '../../shared/file-manager.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ColorPickerDirective} from 'ngx-color-picker';

let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';

@Component({
  selector: 'app-banner-detail',
  templateUrl: './banner-detail.component.html',
  styleUrls: ['./banner-detail.component.scss']
})
export class BannerDetailComponent implements OnInit, OnDestroy {

  public bannerId: number;
  public bannerDetailForm: FormGroup;
  public banner: Banner = {};
  @ViewChild('colorpicker', {static: false}) public colorpicker: ColorPickerDirective;
  public isDropOver: boolean;
  disableButton: boolean = true;
  startDate :string =  '';
  endDate :string =  '';
  subs = new Subscription();
  uploaderPlaceholder = 'لطفا فایل بنر را پس از انتخاب بارگذاری کنید';
  imageToShow: any;
  public isImageLoading = false ;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'محتوا را وارد کنید ...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';
  selectedValue: any;
  color: any;

  constructor(private contentService: ContentService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private fileManagerService: FileManagerService,
              private persianCalendarService: PersianCalendarService) { }

  ngOnInit() {

    this.bannerDetailForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      color: new FormControl(''),
      targetLink: new FormControl(''),
      startDate: new FormControl(''),
      loginType: new FormControl(1, [Validators.required]),
      priority: new FormControl(1, [Validators.required]),

    });
    this.subs.add(this.route.queryParams.subscribe(params => {
      this.bannerId = params['id'];
      if (this.bannerId) {
        this.contentService.findBannerById(this.bannerId).then(res => {
          this.banner = res;
          this.getImageFromService(this.banner.imageId);
          this.selectedValue = this.banner.typeId.toString();
        });
      } else {
        this.selectedValue = 1;
      }
    }))

  }



  edit() {
    if(!this.banner.imageId){
      this.toastr.error('عکسی به عنوان بنر آپلود نشده است');
    } else {
      this.banner.typeId = this.selectedValue;
      if(this.banner.startDate < this.banner.endDate){
        this.contentService.saveBanner(this.banner).then(res=>{
          this.toastr.success('بنر با موفقیت ثبت شد');
          this.bannerDetailForm.reset();
        }).catch(err => {
          this.toastr.error(err.error.message);
        });
      } else {
        this.toastr.error('تاریخ پایان نمایش باید بزرگتر از تاریخ شروع باشد');
      }
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
      this.isImageLoading = true;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService(uuid) {
    this.contentService.getImage(uuid).subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  afterUploadFile(event) {
    this.banner.imageId = event;
    this.getImageFromService(event);
    }

  setStartDate(event: any) {
    this.banner.startDate=event
  }

  setEndDate(event: any) {
    this.banner.endDate=event
  }

    setbannerimage(event: any) {
      this.fileManagerService.saveBASE64File(event).then(res => {
        this.banner.imageId = res;
      }).catch(err => {
        this.toastr.error(err.error.message)
      })
    }
  openChangeImageDialog(content) {
    this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {

    }, (reason) => {
      this.modalService.dismissAll();
    });

  }

  onChangeColor(event) {
    this.banner.color = event.toString();
  }
}
