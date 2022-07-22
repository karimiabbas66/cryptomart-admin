import {ReferenceCourseModel} from './reference-course.model';

export class LessonPlanModel {

    id?: number;
    producer?: string;
    lecture?: string;
    languageId?: number;
    topic?: string;
    story?: string;
    pages?: number;
    description?: string;
    lastPlaceTeach?: string;
    teachNumber?: number;
    confirmed?: boolean;
    referenceCourse?: ReferenceCourseModel[];

}