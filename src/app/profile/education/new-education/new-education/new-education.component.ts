import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UniversityService} from '../../../../organization-management/shared/service/university.service';
import {EducationType} from '../../../shared/dto/EducationType';
import {EducationRate} from '../../../../organization-management/university/model/education-rate';
import {Unit} from '../../../../organization-management/university/model/unit';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {EducationField} from '../../../../organization-management/university/model/education-field';
import {FieldOrientation} from '../../../../organization-management/university/model/field-orientation';
import {PersonalEducations} from '../../../shared/dto/PersonalEducations';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
    selector: 'app-new-education',
    templateUrl: './new-education.component.html',
    styleUrls: ['./new-education.component.scss']
})
export class NewEducationComponent implements OnInit {

    public educationDetailForm: FormGroup;
    degreeType: number;
    personalEducations: PersonalEducations = {};
    typeData: EducationType[] = [];
    degreeTypeData: EducationRate[] = [];
    unitData: Unit[] = [];
    fieldData: EducationField[] = [];
    orientationData: FieldOrientation[] = [];
    subs = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private universityService: UniversityService,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.educationDetailForm = this.formBuilder.group({
            type: new FormControl('', [Validators.required]),
            unit: new FormControl('', [Validators.required]),
            degree: new FormControl('', [Validators.required]),
            field: new FormControl('', [Validators.required]),
            orientation: new FormControl('',),
        });

        this.subs.add(this.route.queryParams.subscribe(params => {
            this.degreeType = params['degreeType'];
            this.personalEducations.personalId = params['id'];
        }));

        this.universityService.getUnitTypeList().then(res => {
            this.typeData = res;
        }).catch(err => {
            this.toastr.error(err.error.message)
        })

        this.universityService.getAllFields().then(res => {
            this.fieldData = res;
        }).catch(err => {
            this.toastr.error(err.error.message)
        })

    }

    loadTypeDegrees(event) {
        if (event != undefined) {
            this.universityService.findAllDegreeByTypeIdAndDegreeType(this.personalEducations.typeId, this.degreeType).then((value: EducationRate[]) => {
                this.degreeTypeData = value;
            }).catch(err => {
                this.toastr.error(err.error.message)
            });
            this.universityService.getAllUnitByNameAndType('', this.personalEducations.typeId).then((value: Unit[]) => {
                this.unitData = value;
            }).catch(err => {
                this.toastr.error(err.error.message)
            });

        }
    }

    loadFieldOrientations(event) {
        if (event != undefined) {
            this.universityService.getOrientationListByFieldId(this.personalEducations.fieldId).then(res => {
                this.orientationData = res;
            }).catch(err => {
                this.toastr.error(err.error.message)
            })
        }
    }

    saveEducation() {
        console.log(this.personalEducations)
        this.universityService.savePersonalEducations(this.personalEducations).then(value => {
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = 'اضافه شد!';
            setting.animation = true;
            setting.type = 'success';
            swal.fire(
                setting
            )
            //TODO ROUTE
        }).catch(reason => {

        });
    }

}
