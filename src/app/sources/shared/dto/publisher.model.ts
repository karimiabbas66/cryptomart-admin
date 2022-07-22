import {Contact} from '../../../profile/shared/dto/Contact';

export class PublisherModel {
  publisherId?: number;
  publisherName?: string;
  licenseNumber?: number;
  publishTypeId?: number;
  publishTypeName?: string;
  description?: string;
  cityId?: number;
  cityName?: string;
  provinceId?: number;
  provinceName?: string;
  managerName?: string;
  postalCode?: string;
  address?: string;
  licenseFileUuid?: string;
  logoUrl?: string;
  publishDate?: number;
  isbn?: number;
  confirmed?: boolean;
  publishedNumber?: number;
  resourceTypeId?: number;
  resourceTypeName?: string;
  contacts?: Array<Contact>;
}
