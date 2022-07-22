import {Component, OnInit, ViewChild} from '@angular/core';
import {EducationalContentModel} from '../shared/dto/educational-content.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {WizardComponent} from 'angular-archwizard';
import {EducationalService} from '../shared/service/educational.service';
import {LessonPlanModel} from '../shared/dto/lesson-plan.model';
import {CourseResourceModel} from '../shared/dto/course-resource.model';

@Component({
    selector: 'app-educational-detail',
    templateUrl: './educational-detail.component.html',
    styleUrls: ['./educational-detail.component.scss']
})
export class EducationalDetailComponent implements OnInit {

    step: number = 1;
    public educationalId: number;
    showProgress: boolean;
    educational: EducationalContentModel = {};
    lessonPlan: LessonPlanModel = {};
    courseResource: CourseResourceModel = {};
    @ViewChild(WizardComponent, {static: false})
    public wizard: WizardComponent;

    constructor(private route: ActivatedRoute,
                private educationalService: EducationalService,
                private router: Router,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.educationalId = param['educationalId'];
            if (this.educationalId) {
                this.showProgress = true;
                this.educationalService.getEducationalById(this.educationalId).then((result: EducationalContentModel) => {
                    this.educational = result;
                    this.showProgress = false;
                }).catch(error => {
                    this.showProgress = false;
                });
            }
        });
    }

    onInfo(data: any) {
        this.step = 2;
        this.educational = data;
        this.wizard.model.navigationMode.goToNextStep();

    }

    onSource(data: any) {
        this.step = 3;
        if (this.educational.educationalType == 'COURSE_RESOURCE') {
            this.educational.courseResourceDto.referenceCourse = data[0];
        } else {
            this.educational.lessonPlanDto.referenceCourse = data;
        }
        console.log('data::::::', this.educational);
        this.educationalService.saveNewConference(this.educational).then((result: EducationalContentModel) => {
            this.toast.success('محتوای آموزشی با موفقیت ذخیره شد');
            this.router.navigate(['/sources/educational-list'], {relativeTo: this.route.parent});
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }


}
