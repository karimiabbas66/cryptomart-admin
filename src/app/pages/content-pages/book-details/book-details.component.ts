import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnInit
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload/ng2-file-upload';
import {BookDetailsModel} from './book-details.model';
import {BookDetailsService} from './book-details.service';
import {AppSettings} from '../../shared/AppSettings';
import {Observable} from 'rxjs/Rx';
import {FieldLenght} from '../../../dashboard/field/FieldLenght';

let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';

@Component({
    selector: 'app-book-details-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './book-details.component.html',
    styleUrls: ['./book-details.component.scss']
})

export class BookDetailsComponent implements OnInit {

    isDropOver: boolean;
    formGroup: FormGroup;
    loading = false;
    submitted = false;
    error: string;
    uploader: FileUploader;
    bookDetailsModel: BookDetailsModel = {};
    fileUuid: string;
    fileName: string;
    disableButton: boolean = true;

    constructor(private router: Router,
                private change: ChangeDetectorRef,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private bookDetailsService: BookDetailsService
    ) {
    }

    ngOnInit() {

        const headers = [{name: 'Accept', value: 'application/json'}];
        this.uploader = new FileUploader({url: URL, autoUpload: false, headers: headers});
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

        this.formGroup = this.formBuilder.group({
            bookName: new FormControl('', [Validators.required]),
            pagesNumber: new FormControl('', [Validators.required]),
            fileTypeName: new FormControl('', [Validators.required]),
        });

    }



    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        let data = JSON.parse(response); //success server response
        this.bookDetailsModel.fileUuid = data.message;
        this.fileName = item.file.name;
        console.log('item::', item.file);
        this.disableButton = false;
        alert('File uploaded')
    }

    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        // let error = JSON.parse(response); //error server response
        alert('Can Not Uploaded File')
    }

    uploadFile() {
        this.uploader.setOptions({url: URL + '?path=' + this.bookDetailsModel.fileType});
        this.uploader.uploadAll();
    }

    get controls() {
        return this.formGroup.controls;
    }

    fileOverAnother(e: any): void {
        this.isDropOver = e;
    }

    saveBookDetails() {
        console.log('fileUuid::', this.fileUuid)
        this.bookDetailsService.saveNewBookResource(this.bookDetailsModel)
            .then(res => {

            }).catch(ex => {

        })

    }

}
