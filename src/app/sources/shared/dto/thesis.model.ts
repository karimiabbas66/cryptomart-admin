import {ThesisInvolvedModel} from './thesis-involved.model';
import {ThesisUniversityModel} from './thesis-university.model';

export class ThesisModel {
    id?: number;
    persianTitle?: string;
    englishTitle?: string;
    year?: number;
    languageId?: number;
    levelId?: number;
    levelTitle?: string;
    pageNumber?: number;
    persianAbstract?: string;
    englishAbstract?: string;
    description?: string;
    confirmed?: boolean;
    fileType?: string;
    fileUuid?: string;
    fileConfirmed?: boolean;
    thesisInvolvedList?: ThesisInvolvedModel[];
    thesisUniversityDto?: ThesisUniversityModel;
    thesisKeywordDtoList?: string[];

}
