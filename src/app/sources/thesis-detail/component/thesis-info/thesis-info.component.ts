import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ThesisModel} from '../../../shared/dto/thesis.model';
import {ThesisService} from '../../../shared/service/thesis.service';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-thesis-info',
    templateUrl: './thesis-info.component.html',
    styleUrls: ['./thesis-info.component.scss']
})
export class ThesisInfoComponent implements OnInit {
    thesisForm: FormGroup;
    showProgress: boolean;
    languages: any;
    level: any;
    thesisKeyword: any[] = [];
    @Input() public thesis: ThesisModel;
    @Output() thesisInfoEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private thesisService: ThesisService,
                private toast: ToastrService,
                private formBuilder: FormBuilder,
                private ngbModal: NgbModal) {
    }

    ngOnInit() {
        this.thesisForm = this.formBuilder.group({
            persianTitle: new FormControl(''),
            englishTitle: new FormControl(''),
            year: new FormControl('', [Validators.required]),
            languageId: new FormControl('', [Validators.required]),
            levelId: new FormControl('', [Validators.required]),
            pageNumber: new FormControl(''),
            persianAbstract: new FormControl(''),
            englishAbstract: new FormControl(''),
            description: new FormControl(''),
            confirmed: new FormControl(''),
            thesisKeyword: '',
        });

        this.languages = [
            {id: 0, name: 'فارسی'}, {id: 1, name: 'انگلیسی'},
            {id: 2, name: 'عربی'}, {id: 3, name: 'سایر'}
        ];

        this.level = [
            {id: 1, name: 'کارشناسی'}, {id: 2, name: 'کارشناسی ارشد'}, {id: 3, name: 'دکتري حرفه اي'}
            , {id: 4, name: 'phd دکتري تحصصی'}, {id: 5, name: 'سطح 3 حوزه علمیه'}, {id: 6, name: 'سطح 4 حوزه علمیه'}
        ];

    }

    edit() {
        this.thesis.thesisKeywordDtoList = this.thesisKeyword.map(key => key.value);
        this.thesisInfoEmitter.emit(this.thesis);
    }
}
