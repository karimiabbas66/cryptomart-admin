import {FieldMeta} from './FieldMeta';

export class FieldMetaSuggestion{
    fieldMeta?:FieldMeta[];
    suggests?:Map<string, string>;
}