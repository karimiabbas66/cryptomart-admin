import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EducationService} from './education.service';
import {EducationInformation} from '../shared/dto/EducationInformation';
import {EducationType} from '../shared/dto/EducationType';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs-compat/Subscription';
import {ToastrService} from 'ngx-toastr';
import {PersonalEducations} from '../shared/dto/PersonalEducations';
import swal, {SweetAlertOptions} from 'sweetalert2';


@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

    degreeType = 1;
    personalEducations: PersonalEducations[];

    @Input() profileId: string;

    constructor(private service: EducationService, private toa: ToastrService) {

    }

    ngOnInit() {
        this.service.getEducationInformation(this.profileId, this.degreeType).then(data => {
            this.personalEducations = data;
        })

    }

    removePersonEducation(edu) {
        edu.personalId = this.profileId;
        this.service.deleteEducationInformation(edu).then(value => {
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!حدف شد';
            setting.animation = true;
            setting.text = '.آیتم  انتخاب شده حذف شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.service.getEducationInformation(this.profileId, this.degreeType).then(data => {
                this.personalEducations = data;
            })
        }).catch(reason => {
            this.toa.error(reason.error.message);
        })
    }


}

