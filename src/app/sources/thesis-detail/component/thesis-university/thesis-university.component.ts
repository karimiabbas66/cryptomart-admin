import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThesisModel} from '../../../shared/dto/thesis.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UniversityService} from '../../../../organization-management/shared/service/university.service';
import {ToastrService} from 'ngx-toastr';
import {EducationField} from '../../../../organization-management/university/model/education-field';
import {ThesisService} from '../../../shared/service/thesis.service';
import {ThesisUniversityModel} from '../../../shared/dto/thesis-university.model';
import {Unit} from '../../../../organization-management/university/model/unit';

@Component({
    selector: 'app-thesis-university',
    templateUrl: './thesis-university.component.html',
    styleUrls: ['./thesis-university.component.scss']
})
export class ThesisUniversityComponent implements OnInit {

    @Input() thesis: ThesisModel;
    @Output() thesisEmitter: EventEmitter<any> = new EventEmitter<any>();
    universityForm: FormGroup;
    universityModel: ThesisUniversityModel = {};
    showProgress: boolean;

    unitLength: number = 0;
    countAllUnit: number;
    units: Unit[] = [];

    educationLength: number = 0;
    countAllEducation: number;
    educationFields: EducationField[] = [];

    loading: boolean;
    numberOfItemsFromEndBeforeFetchingMore: number = 2;

    constructor(private formBuilder: FormBuilder,
                private universityService: UniversityService,
                private thesisService: ThesisService,
                private change: ChangeDetectorRef,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.universityForm = this.formBuilder.group({
            educationId: new FormControl('', [Validators.required]),
            fieldId: new FormControl('', [Validators.required]),
            college: new FormControl('', [Validators.required])
        });
        this.universityService.countAllField().then((res: number) => {
            this.countAllEducation = res;
            this.showProgress = false;
            this.searchEducation(null);
        }).catch(err => {
            this.showProgress = false;
            this.toast.error(err.error.message)
        });
        this.universityService.countUnit().then((result: number) => {
            this.countAllUnit = result;
            this.showProgress = false;
            this.searchUnits(null);
        }).catch(err => {
            this.showProgress = false;
            this.toast.error(err.error.message)
        });
        if (this.thesis.id) {
            this.thesisService.getUniversityByThesisId(this.thesis.id).then((result: ThesisUniversityModel) => {
                this.universityModel = result;
            });
        }

    }

    onScrollUnit({end}) {
        if (this.loading || this.units.length <= this.countAllUnit) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.countAllUnit) {
            this.searchUnits(null);
        }
    }

    onScrollToEndUnit() {
        this.searchUnits(null);
    }

    searchUnits(event) {
        if (event == null && this.unitLength * 10 >= this.countAllUnit) {
            return;
        }
        if (event != null) {
            this.unitLength = 0;
        }
        this.universityService.getUnitList(this.unitLength, 10).then((result: EducationField[]) => {
            this.units = result;
            this.change.detectChanges();
            this.unitLength += 1;
        }).catch(err => {
            this.toast.error(err.error.message)
        });
    }

    onScrollEducation({end}) {
        if (this.loading || this.educationFields.length <= this.countAllEducation) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.countAllEducation) {
            this.searchEducation(null);
        }
    }

    onScrollToEndEducation() {
        this.searchEducation(null);
    }

    searchEducation(event) {
        if (event == null && this.educationLength * 10 >= this.countAllEducation) {
            return;
        }
        if (event != null) {
            this.educationLength = 0;
        }
        this.universityService.getThirdEducationGroup(this.educationLength, 10).then((result: EducationField[]) => {
            this.educationFields = result;
            this.change.detectChanges();
            this.educationLength += 1;
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }


    addUniversity() {
        this.thesisEmitter.emit(this.universityModel)
    }

}
