import {ReferenceCourseModel} from './reference-course.model';

export class CourseResourceModel {

    id?: number;
    creator?: string;
    teacher?: string;
    sessionNumbers?: number;
    place?: string;
    description?: string;
    confirmed?: boolean;
    pages?: number;
    topic?: string;
    languageId?: number;
    lecture?: string;
    referenceCourse?: ReferenceCourseModel;
}