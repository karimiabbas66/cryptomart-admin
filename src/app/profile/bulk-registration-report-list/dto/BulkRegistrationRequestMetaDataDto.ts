import {PersonalInformation} from '../../../leader-management/shared/dto/PersonalInformation';

export class BulkRegistrationRequestMetaDataDto {
    id?: number;
    userId?: string;
    fileUUID?: string;
    creator?: string;
    firstName?: string;
    lastName?: string;
    createdDate?: number;
    fileStatus?: any;
    totalRecord?: number;
    numOfProcessed?: number;
    description?: string;
    title?: string;
}