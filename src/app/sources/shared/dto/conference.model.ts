import {ConferenceOrganizationModel} from './conference-organization.model';

export class ConferenceModel {

    id?: number;
    title?: string;
    conferenceNumber?: number;
    conferenceCityPlace?: string;
    conferenceStatePlace?: string;
    conferencePlace?: string;
    conferenceDate?: number;
    link?: number;
    picture?: string;
    conferenceSubjects?: string[];
    conferenceOrgDtoList?: ConferenceOrganizationModel[];

}
