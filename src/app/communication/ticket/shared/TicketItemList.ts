export class TicketItemList{
    id?:number;
    innerId?:number;
    ticketParentId?:number;
    checked?:boolean;
    description?:string;
    categoryEnum?:number;
    ticketState?:number;
    referType?:number;
    chatType?:string;
    referredById?:string;
    referredToId?:string;
    title?:string;
    responsibleId?:string;
    responsibleFirstName?:string;
    responsibleLastName?:string;
    responsibleUserName?:string;
    userName?: string;
    creatorUid?:string;
    creatorFirstName?: string;
    creatorLastName?: string;
    creatorNationalCode?: string;
    personalInformationId?: string;
    createDate?: number;
    seenDate?: number;
    mobile?: string;
    fileType?: string;
    fileUuid?: string;
    isRead?:boolean;
    isClosed?:boolean;
    lastAnswered?:string;
}
