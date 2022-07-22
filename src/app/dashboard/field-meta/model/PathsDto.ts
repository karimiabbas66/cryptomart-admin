import {RelationshipModel} from './RelationshipModel';


export class PathsDto {
    rels?: RelationshipModel[] = [];
    name?: string;
    hasChild?:boolean
    id?: number;
    children?:PathsDto[]=[];
}
