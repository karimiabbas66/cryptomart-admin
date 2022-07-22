import {AuthorModel} from './author.model';
import {PublisherModel} from './publisher.model';
import {OwnerModel} from './owner.model';


export class BookModel {
  id?: number;
  title?: string;
  subject?: string;
  shortTitle?: string;
  collectionTitle?: string;
  collectionNumber?: number;
  editionNumber?: number;
  totalVolumeCount?: number;
  resourceTypeId?: number;
  resourceTypeName?: string;
  pageCount?: number;
  fileType?: string;
  fileUuid?: string;
  createDate?: number;
  authors?: AuthorModel[];
  publisher?: PublisherModel;
  owners?: OwnerModel[];
  isbn?: number;
  volume?: number;
  summary?: string;
  confirmed?: boolean;
  languageId?: number;
  publishedNumber?: number;
  ownerConfirmed?: boolean;
  authorConfirmed?: boolean;
  publisherConfirmed?: boolean;
  fileConfirmed?: boolean;
  isReference?: boolean;
}

enum Language {
  persian,
  english,
  arabic,
  others
}
