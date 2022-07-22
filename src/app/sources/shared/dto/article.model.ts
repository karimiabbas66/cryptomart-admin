import {AuthorModel} from './author.model';
import {OwnerModel} from './owner.model';
import {ArticleReferenceModel} from './article-reference.model';


export class ArticleModel {
  id?: number;
  title?: string;
  doiNumber?: string;
  languageId?: number;
  totalPageNumber?: number;
  authorKeywords?: string[];
  articleAbstract?: string;
  description?: string;
  confirmed?: boolean;
  createDate?: number;
  resourceAuthorDtos?: AuthorModel[];
  ownerDtos?: OwnerModel[];
  articleReferenceDtos?: ArticleReferenceModel[];
  ownerConfirmed?: boolean;
  authorConfirmed?: boolean;
  fileConfirmed?: boolean;
  fileType?: string;
  fileUuid?: string;
}

enum Language {
  persian,
  english,
  arabic,
  others
}
