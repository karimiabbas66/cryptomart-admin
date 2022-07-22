import {Component, OnInit} from '@angular/core';
import {BulkRequestDto} from './dto/bulk-request-dto';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BulkRegistrationService} from './bulk-registration.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-bulk-registration',
    templateUrl: './bulk-registration.component.html',
    styleUrls: ['./bulk-registration.component.scss']
})
export class BulkRegistrationComponent implements OnInit {

    requestDto: BulkRequestDto = {};
    patch = 'bulkRegister';
    public bulkForm: FormGroup;

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
    showHelp = false;

    constructor(private bulkService: BulkRegistrationService,
                private formBuilder: FormBuilder,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.bulkForm = this.formBuilder.group({
                title: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required])
            }
        )
    }

    saveRequest(): void {
        this.bulkService.sendBulkRegistrationRequest(this.requestDto).then(res => {
            this.toastr.success('درخواست شما با موفقیت ثبت شد و وضعیت آن از منوی لیست درخواستهای ثبت نام دسته ای قابل مشاهده است')
        }, err => {
            this.toastr.error(err.error.message);
        })
    }

    afterUploadBookFile(event) {
        this.requestDto.fileUUID = event;
    }
}
