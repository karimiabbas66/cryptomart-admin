import {Contact} from '../../../profile/shared/dto/Contact';

export class OrganizationModel {
    id?: number;
    name?: string;
    licenseNumber?: number;
    licenseConfirmation?: number;
    logoUuid?: number;
    managerName?: string;
    cityId?: number;
    organizationOwnerId?: number;
    organizationTypeId?: number;
    postalCode?: string;
    address?: string;
    phoneNumber?: string;
    licenseFileUuid?: string;
    mobileNumber?: string;
    email?: string;
    description?: string;
    createDate?: number;
    provinceName?: string;
    cityName?: string;
    provinceId?: number;
    typeDescription?: string;
    ownerDescription?: string;
    confirmed?: boolean;
    contacts?: Array<Contact>;
}
