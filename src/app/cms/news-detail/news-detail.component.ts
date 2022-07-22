import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload/ng2-file-upload';
import {News} from '../shared/dto/News';
import {ContentService} from '../shared/service/content.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PersianCalendarService} from '../../shared/services/persian-calendar.service';
import {AppSettings} from '../../pages/shared/AppSettings';
import {Subscription} from 'rxjs';
import {FileManagerService} from '../../shared/file-manager.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularEditorConfig} from '@kolkov/angular-editor';

let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';

@Component({
    selector: 'app-news-detail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit,OnDestroy {
    public newsId: number;
    public newsDetailForm: FormGroup;
    public news: News = {};
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';
    public isDropOver: boolean;
    disableButton: boolean = true;
    startDate: string = '';
    subs = new Subscription();
    endDate: string = '';
    imgUrl: string;


    uploader: FileUploader;
    thumbnailUploader: FileUploader;
    selectedValue: any;
    public thumbnailImageToShow: any;
    public imageToShow: any;
    public isImageLoading = false;

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


    constructor(private contentService: ContentService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private modalService: NgbModal,
                private fileManagerService: FileManagerService,
                private persianCalendarService: PersianCalendarService) {
    }

    ngOnInit() {

        this.newsDetailForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            loginType: new FormControl(1, [Validators.required]),
            priority: new FormControl(1, [Validators.required]),
            summary: new FormControl('', [Validators.required]),
            content: new FormControl('', [Validators.required]),

        });
        const headers = [{name: 'Accept', value: 'application/json'}];
        this.uploader = new FileUploader({url: URL, autoUpload: false, headers: headers});
        this.thumbnailUploader = new FileUploader({url: URL, autoUpload: false, headers: headers});
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };

        this.thumbnailUploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

        this.thumbnailUploader.onErrorItem = (item, response, status, headers) => this.onErrorThumbnailItem(item, response, status, headers);
        this.thumbnailUploader.onSuccessItem = (item, response, status, headers) => this.onSuccessThumbnailItem(item, response, status, headers);
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.newsId = params['id'];
            if (this.newsId) {
                this.contentService.findNewsById(this.newsId).then(res => {
                    this.news = res;
                    if(this.news.imageId){
                        this.getImageFromService(this.news.imageId);
                    }
                    if(this.news.thumbnailImageId){
                        this.getThumbnailImageFromService(this.news.thumbnailImageId);
                    }
                    this.selectedValue = this.news.typeId.toString();

                    this.startDate = this.persianCalendarService.convertEpochToJalaliString(this.news.startDate);
                    this.endDate = this.persianCalendarService.convertEpochToJalaliString(this.news.endDate);
                });
            } else {
                this.selectedValue = 1;
            }
        }))

    }


    edit() {
        this.news.startDate = this.persianCalendarService.convertJalaliStringToEpoch(this.startDate);
        this.news.endDate = this.persianCalendarService.convertJalaliStringToEpoch(this.endDate);

        this.news.typeId = this.selectedValue;
        if (this.news.startDate < this.news.endDate) {
            this.contentService.saveNews(this.news).then(res => {
                this.toastr.success('خبر با موفقیت ثبت شد');
                this.newsDetailForm.reset();
            }).catch(err => {
                this.toastr.error(err.error.message);
            });

        }
    }

    fileOverAnother(e: any): void {
        this.isDropOver = e;
    }

    uploadFile() {
        this.uploader.setOptions({url: URL + '?path=news'});
        this.uploader.uploadAll();
    }


    uploadThumbnailFile() {
        this.thumbnailUploader.setOptions({url: URL + '?path=news'});
        this.thumbnailUploader.uploadAll();
    }

    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        let data = JSON.parse(response); //success server response
        this.news.imageId = data.message;
        console.log('image id is: ', this.news.imageId);
        this.disableButton = false;
        this.toastr.info('فایل با موفقیت آپلود شد')
        this.getImageFromService(this.news.imageId);
    }

    onSuccessThumbnailItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        let data = JSON.parse(response); //success server response
        this.news.thumbnailImageId = data.message;
        console.log('image id is: ', this.news.thumbnailImageId);
        this.disableButton = false;
        this.toastr.info('فایل با موفقیت آپلود شد')
        this.getThumbnailImageFromService(this.news.thumbnailImageId);
    }

    createImageFromBlob(image: Blob) {
        console.log('form blob', image)
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.imageToShow = reader.result;
            console.log('image to show', this.imageToShow)
            this.isImageLoading = true;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    createThumbnailImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.thumbnailImageToShow = reader.result;
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

    getThumbnailImageFromService(uuid) {
        this.contentService.getImage(uuid).subscribe(data => {
            this.createThumbnailImageFromBlob(data);
        }, error => {
            console.log(error);
        });
    }

    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        // let error = JSON.parse(response); //error server response
        this.toastr.error('خطا در آپلود فایل', response)
    }

    onErrorThumbnailItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        // let error = JSON.parse(response); //error server response
        this.toastr.error('خطا در آپلود فایل', response)
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    setThumbimage(event: any) {
        this.fileManagerService.saveBASE64File(event).then(res => {
            this.news.thumbnailImageId = res;
        }).catch(err => {
            this.toastr.error(err.error.message)
        })
    }
    setbannerimage(event: any) {
        this.fileManagerService.saveBASE64File(event).then(res => {
            this.news.imageId = res;
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
}
