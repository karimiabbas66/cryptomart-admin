import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthorService} from '../../../shared/service/author.service';

@Component({
    selector: 'app-thesis-file',
    templateUrl: './thesis-file.component.html',
    styleUrls: ['./thesis-file.component.scss']
})
export class ThesisFileComponent implements OnInit {

    public formGroup: FormGroup;

    @Input() public file: { fileType?: string; fileUuid?: string, fileConfirmed?: boolean } = {};
    @Output() fileEmitter: EventEmitter<any> = new EventEmitter<any>();
    selectedType: string = 'word';
    placeholder: string = 'لطفا فایل پایان نامه را انتخاب و بارگذاری کنید';
    disableButton: boolean = true;
    fileUuid: string;
    fileTypes = [{name: 'pdf'}, {name: 'word'}];
    confirmed: boolean;
    warning: string;
    count: number;

    constructor(private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private modalService: NgbModal,
                private authorService: AuthorService) {
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            fileType: new FormControl('', [Validators.required]),
        });
        if (this.file.fileUuid != null) {
            this.warning = 'در صوورتی که نمی خواهید فایل جدید برای پایان نامه بارگذاری کنید روی دکمه ثبت کلیک کنید';
            this.fileUuid = this.file. fileUuid;
            this.selectedType = this.file.fileType;
            this.confirmed = this.file.fileConfirmed;
        }
    }

    afterUploadFile(event) {
        this.fileUuid = event;
        this.disableButton = false;
    }

    addFile() {
        this.fileEmitter.emit({fileUuid: this.fileUuid, fileType: this.selectedType, fileConfirmed: this.confirmed})
    }
}
