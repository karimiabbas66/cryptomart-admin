import {Contact} from '../../../profile/shared/dto/Contact';


export class AuthorModel {
  authorId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  authorTypeId?: number;
  authorTypeName?: string;
  birthDate?: number;
  deathDate?: number;
  dateType?: number;
  gender?: boolean;
  profileId?: string;
  authorNicknames?: string[];
  confirmed?: boolean;
  contacts?: Array<Contact>;
  authorConfirmed?: boolean;
}
