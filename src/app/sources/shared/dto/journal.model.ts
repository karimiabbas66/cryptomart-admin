import {JournalScoreModel} from './journal-score.model';
import {OwnerModel} from './owner.model';
import {Contact} from '../../../profile/shared/dto/Contact';
import {InvolvedModel} from './involved.model';

export class JournalModel {
    id?: number;
    title?: string;
    startReleaseDate?: number;
    specialistArea?: string;
    updateDate?: number;
    electronicISSN?: string;
    printISSN?: string;
    languageId?: number;
    releaseType?: number;
    releaseTypeName?: string;
    releasePeriod?: number;
    aboutJournal?: string;
    journalPhoto?: string;
    webSite?: string;
    address?: string;
    fileUuid?: string;
    confirmed?: boolean;
    description?: string;
    journalInvolvedConfirmed?: boolean;
    contactDtoList?: Array<Contact>;
    owners?: OwnerModel[];
    journalScoreDto?: JournalScoreModel;
    resourceInvolveDtoList?: InvolvedModel[];

}
