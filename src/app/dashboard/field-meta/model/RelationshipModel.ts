export class RelationshipModel{
    id?:number;
    type?:string;
    startNode?:number;
    endNode?:number;
    propertyList?:any[]=[];
}