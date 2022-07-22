export class Operations{
    key?: number;
    operationString?: string;
    name?: string;
    path?: string;
    label?: string;
    inherit?: boolean;
    internal?: boolean;
    parent?:Operations;
    children?:Operations[]=[];

}
