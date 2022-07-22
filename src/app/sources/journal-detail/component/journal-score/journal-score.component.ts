import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JournalModel} from '../../../shared/dto/journal.model';
import {JournalScoreModel} from '../../../shared/dto/journal-score.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JournalService} from '../../../shared/service/journal.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-journal-score',
    templateUrl: './journal-score.component.html',
    styleUrls: ['./journal-score.component.scss']
})
export class JournalScoreComponent implements OnInit {

    @Input() journal: JournalModel;
    @Output() journalScoreEmitter: EventEmitter<any> = new EventEmitter<any>();
    showProgress: boolean = false;
    journalScoreModel: JournalScoreModel = {};
    public scoreForm: FormGroup;
    nations: any;
    oldType: any;
    newType: any;
    scimagoType: any;


    constructor(private journalService: JournalService,
                private formBuilder: FormBuilder,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;

        this.scoreForm = this.formBuilder.group({
            isiScore: new FormControl(''),
            iscScore: new FormControl(''),
            hIndexScore: new FormControl(''),
            scienceNewScore: new FormControl(''),
            scienceOldScore: new FormControl(''),
            scopusScore: new FormControl(''),
            eigenFactorScore: new FormControl(''),
            scimagoScoreId: new FormControl(''),
            otherScoreDescription: new FormControl('')
        });

        this.oldType = [{id: 0, name: 'علمی پژوهشی'}, {id: 1, name: 'علمی ترویجی'}];

        this.newType = [{id: 0, name: 'الف'}, {id: 0, name: 'ب'}, {id: 0, name: 'ج'}, {id: 0, name: 'د'}];

        this.scimagoType = [{id: 0, name: 'Q1'}, {id: 1, name: 'Q2'}, {id: 2, name: 'Q3'}, {id: 3, name: 'Q4'}];

        if (this.journal) {
            this.journalService.getJournalScores(this.journal.id).then((res: JournalScoreModel) => {
                this.journalScoreModel = res;
                this.showProgress = false;
            }).catch(error => {
                this.showProgress = false;
            });
        }
    }


    edit() {
        this.journalScoreEmitter.emit(this.journalScoreModel);
    }
}
