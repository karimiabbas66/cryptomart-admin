export class Field{
    id?:number;
    name?:string;
    createdDate?:number;
    userId?:string;
    hasAccess?:boolean;
    description?:string;
    describe?:string;
    isVertical?:boolean;
    isShownInAddress?:boolean;
    hasChild?:boolean;
    fieldType?:number;
    keywords?:string[]=[];
    parentId?:number;
    relationName?:string;
}
