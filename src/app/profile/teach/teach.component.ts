import {Component, Input, OnInit} from '@angular/core';
import {TeachService} from './teach.service';
import {EducationService} from '../education/education.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {PersonalEducations} from '../shared/dto/PersonalEducations';

@Component({
    selector: 'app-teach',
    templateUrl: './teach.component.html',
    styleUrls: ['./teach.component.scss']
})
export class TeachComponent implements OnInit{

    constructor(private service: TeachService,
                private educationService: EducationService,
                private toa: ToastrService,
                private formBuilder: FormBuilder) {
    }

    degreeType = 2;
    personalEducations: PersonalEducations[];

    @Input() profileId: string;

    ngOnInit() {
        this.educationService.getEducationInformation(this.profileId, this.degreeType).then(data => {
            this.personalEducations = data;
        }).catch(reason => {
            this.toa.error(reason.error.message);
        })
    }

    removePersonEducation() {

    }


}
