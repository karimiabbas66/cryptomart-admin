import {CourseResourceModel} from './course-resource.model'
import {LessonPlanModel} from './lesson-plan.model'

export class EducationalContentModel {

    id?: number
    educationalType?: string;
    lessonPlanDto?: LessonPlanModel;
    courseResourceDto?: CourseResourceModel;
    creator?: string;
    lecture?: string;
    topic?: string;
    page?: number;

}