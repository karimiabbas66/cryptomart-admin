import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppSettings} from '../../pages/shared/AppSettings';
import {FileUploader,} from 'ng2-file-upload/ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

    uploader: FileUploader;
    @Input() public buttonName: string = 'انتخاب فایل';
    @Input() public patch: string;
    @Input() public index: string;
    @Output() fileUuid: EventEmitter<any> = new EventEmitter();
    emptyFileList = true;

    @Input()
    accept: any ='*';
    fileList: any;
    progress: number = 0;
    label: string;

    constructor(private toastr: ToastrService, private http: HttpClient) {
    }

    ngOnInit() {
        if (this.index) {
            this.label = this.patch + '-' + this.index;
        } else {
            this.label = this.patch;
        }
    }


    upload(file) {
        this.progress = 1;
        const formData = new FormData();
        formData.append('file', file);

        this.http
            .post(URL + '?path=' + this.patch, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                map((event: any) => {
                    if (event.type == HttpEventType.UploadProgress) {
                        this.progress = Math.round((100 / event.total) * event.loaded);
                    } else if (event.type == HttpEventType.Response) {
                        this.progress = null;
                        this.fileUuid.emit(event.body.message);
                        this.toastr.info('فایل با موفقیت آپلود شد')
                    }
                }),
                catchError((err: any) => {
                    this.progress = null;
                    this.toastr.error('خطا در آپلود فایل', err.error.message)
                    return throwError(err.message);
                })
            )
            .toPromise();
    }
}
