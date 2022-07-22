import {Contact} from '../../../profile/shared/dto/Contact';
import {UnitContact} from './unit-contact';

export class Unit {
    unitId?: number;
    name?: string;
    address?: string;
    createDate?: number;
    typeId?: number;
    typeName?: string;
    provinceId?: number;
    provinceName?: string;
    cityId?: number;
    cityName?: string;
    unitContacts?:UnitContact[];
}
