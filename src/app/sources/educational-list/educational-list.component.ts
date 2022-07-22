import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {EducationalContentModel} from '../shared/dto/educational-content.model';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {EducationalService} from '../shared/service/educational.service';

@Component({
    selector: 'app-educational-list',
    templateUrl: './educational-list.component.html',
    styleUrls: ['./educational-list.component.scss']
})
export class EducationalListComponent implements OnInit {

    showProgress: boolean = false;
    tableSize: number = 5;
    totalSize: number;
    educationalContent: EducationalContentModel[] = [];

    constructor(private change: ChangeDetectorRef,
                private toastr: ToastrService,
                private educationalService: EducationalService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.educationalService.getEducationalCount().then((result: number) => {
            this.totalSize = result;
        }).catch(error => {
            return error;
        });
        this.getAllEducationalContent(null);
    }

    getAllEducationalContent(pageSize) {
        this.showProgress = true;
        const page: number = +pageSize;
        this.educationalService.getAll(page, this.tableSize).then((result: EducationalContentModel[]) => {
            this.showProgress = false;
            this.educationalContent = result;
            if (this.educationalContent) {
                this.educationalContent.forEach(educational => {
                    switch (educational.educationalType) {
                        case 'COURSE_RESOURCE':
                            educational.creator = educational.courseResourceDto.creator;
                            educational.lecture = educational.courseResourceDto.lecture;
                            educational.topic = educational.courseResourceDto.topic;
                            educational.page = educational.courseResourceDto.pages;
                            break;
                        case 'LESSON_PLAN':
                            educational.creator = educational.lessonPlanDto.producer;
                            educational.lecture = educational.lessonPlanDto.lecture;
                            educational.topic = educational.lessonPlanDto.topic;
                            educational.page = educational.lessonPlanDto.pages;
                            break;
                    }
                })
            }
            this.change.detectChanges();
        }).catch(error => {
            this.toastr.error(error.error.errorMessage);
        })
    }

    removeEducational(id: number) {
        swal.fire({
            title: 'آیا از حذف محتوای آموزشی اطمینان دارید؟',
            text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            if (result.value) {
                this.educationalService.removeConference(id).then(res => {
                    this.educationalService.getEducationalCount().then((count: number) => {
                        this.totalSize = count;
                        this.educationalService.getAll(0, this.tableSize).then((result: EducationalContentModel[]) => {
                            this.educationalContent = result;
                            if (this.educationalContent) {
                                this.educationalContent.forEach(educational => {
                                    switch (educational.educationalType) {
                                        case 'COURSE_RESOURCE':
                                            educational.creator = educational.courseResourceDto.creator;
                                            educational.lecture = educational.courseResourceDto.lecture;
                                            educational.topic = educational.courseResourceDto.topic;
                                            educational.page = educational.courseResourceDto.pages;
                                            break;
                                        case 'LESSON_PLAN':
                                            educational.creator = educational.lessonPlanDto.producer;
                                            educational.lecture = educational.lessonPlanDto.lecture;
                                            educational.topic = educational.lessonPlanDto.topic;
                                            educational.page = educational.lessonPlanDto.pages;
                                            break;
                                    }
                                });
                            }
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.محتوای آموزشی انتخاب شده حذف شد';
                            setting.type = 'success';
                            swal.fire(setting)
                        });
                    });
                }).catch(error => {
                    this.toastr.error(error.error.message);
                });
            }
        });
    }


}



