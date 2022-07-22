import {Contact} from './Contact';

export class Personal {
    id?: string;
    firstName?: string;
    lastName?: string;
    nationalCode?: string;
    userName?: string;
    contacts?: Array<Contact>;
    mainPhone?: string;
    address?: string;
    gender?: boolean;
    birthDate?: number;
    isEnable?: boolean;
    marital?: string;
    photo?: string;
    createDate?: number;
}
