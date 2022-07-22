import {Contact} from '../../../profile/shared/dto/Contact';

export class InvolvedModel {

    involveId?: number;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    gender?: boolean;
    deathDate?: number;
    birthDate?: number;
    dateType?: number;
    profileId?: string;
    involveTypeId?: number;
    involveTypeName?: string;
    confirmed?: boolean;
    contacts?: Array<Contact>;

}
