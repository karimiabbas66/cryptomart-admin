export class ResearchSheetDto {
    researchSheetId?: string;
    title?: string;
    description?: string;
    creator?: string;
    content?: string;
    createdDate?: number;
    updatedDate?: number;
    isPublic?: boolean;
    rate?: number;
    hasSubmited?: boolean;
    fromPage?: number;
    toPage?: number;
    fromResourcePage?: number;
    toResourcePage?: number;
    internal?: boolean;
    researchSheetType?: string;
    resourceId?: number;
    relationType?: number;
    commentId?: string;
    version?: number = 0;
    type?: number;
}
