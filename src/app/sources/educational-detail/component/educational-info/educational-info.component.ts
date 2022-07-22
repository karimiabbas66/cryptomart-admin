import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EducationalContentModel} from '../../../shared/dto/educational-content.model';
import {LessonPlanModel} from '../../../shared/dto/lesson-plan.model';
import {CourseResourceModel} from '../../../shared/dto/course-resource.model';
import {EducationalService} from '../../../shared/service/educational.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-educational-info',
    templateUrl: './educational-info.component.html',
    styleUrls: ['./educational-info.component.scss']
})
export class EducationalInfoComponent implements OnInit {
    lessonForm: FormGroup;
    courseForm: FormGroup;
    educationalId: number;
    showProgress: boolean;
    @Input() model: EducationalContentModel;
    @Output() educationalEmitter: EventEmitter<any> = new EventEmitter<any>();
    lessonModel: LessonPlanModel = {};
    courseModel: CourseResourceModel = {};
    languages: any;

    constructor(private educationalService: EducationalService,
                private router: Router,
                private formBuilder: FormBuilder,
                private toast: ToastrService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.educationalId = params['educationalId'];
            this.lessonForm = this.formBuilder.group({
                producer: new FormControl('', [Validators.required]),
                lecture: new FormControl('', [Validators.required]),
                topic: new FormControl(''),
                languageId: new FormControl('', [Validators.required]),
                story: new FormControl(''),
                pages: new FormControl(''),
                description: new FormControl(''),
                confirmed: new FormControl(''),
                teachNumber: new FormControl(''),
                lastPlaceTeach: new FormControl(''),
                referenceCourse: new FormControl(''),
            });

            this.courseForm = this.formBuilder.group({
                creator: new FormControl('', [Validators.required]),
                teacher: new FormControl('', [Validators.required]),
                sessionNumbers: new FormControl(''),
                place: new FormControl(''),
                description: new FormControl(''),
                confirmed: new FormControl(''),
                pages: new FormControl(''),
                topic: new FormControl(''),
                lecture: new FormControl('', [Validators.required]),
                languageId: new FormControl(''),
                referenceCourse: new FormControl(''),
            });

            this.languages = [{id: 0, name: 'فارسی'}, {id: 1, name: 'انگلیسی'}, {id: 2, name: 'عربی'}, {id: 3, name: 'سایر'}];

            if (this.educationalId) {
                this.showProgress = true;
                this.educationalService.getEducationalById(this.educationalId).then((result: EducationalContentModel) => {
                    this.model = result;
                    console.log(this.model);
                    if (this.model.educationalType == 'COURSE_RESOURCE') {
                        this.courseModel = this.model.courseResourceDto;
                    } else {
                        this.lessonModel = this.model.lessonPlanDto
                    }
                    this.showProgress = true;
                }).catch(error => {
                    this.showProgress = false;
                });
            }
        });
    }

    chooseCourse() {
        this.lessonModel = {}
        this.model.educationalType = 'COURSE_RESOURCE';
    }

    chooseLesson() {
        this.courseModel = {}
        this.model.educationalType = 'LESSON_PLAN';
    }

    edit() {
        this.model.lessonPlanDto = this.lessonModel;
        this.model.courseResourceDto = this.courseModel;
        this.educationalEmitter.emit(this.model);
        console.log(this.model);
    }

}
