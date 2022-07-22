import {OwnerModel} from './owner.model';
import {InvolvedModel} from './involved.model';
import {Contact} from '../../../profile/shared/dto/Contact';

export class MagazineModel {

    id?: number;
    title?: string;
    startReleaseDate?: number;
    magazineType?: number;
    magazineTypeName?: string;
    languageId?: number;
    specialistArea?: string;
    releaseType?: number;
    releaseTypeName?: string;
    releasePeriod?: number;
    website?: string;
    aboutMagazine?: string;
    magazinePhoto?: string;
    magazineInvolveConfirmed?: boolean;
    description?: string;
    address?: string;
    confirmed?: boolean;
    owners?: OwnerModel[];
    resourceInvolveDtoList?: InvolvedModel[];
    contactDtoList?: Array<Contact>;

}
