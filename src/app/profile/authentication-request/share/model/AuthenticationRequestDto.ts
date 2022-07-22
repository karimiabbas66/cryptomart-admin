export class AuthenticationRequestDto {
    id?:number;
    personalId?:string;
    status?:boolean;
    description?:string;
    requestDate?:number;
    changeStatusBy?:string;
    changeStatusDate?:number;
    files?:string[];
}