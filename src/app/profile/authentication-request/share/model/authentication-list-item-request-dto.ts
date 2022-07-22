export class AuthenticationListItemRequestDto {
    id?: number;
    personalId?: string;
    nationalCode?: string;
    username?: string;
    mainPhone?: string;
    status?: boolean;
    description?: string;
    requestDate?: number;
    changeStatusBy?: string;
    changeStatusDate?: number;
    files?: string[];
}
