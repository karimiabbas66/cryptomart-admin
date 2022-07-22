export class TaskEditModel {
    id?: number;
    name?: string;
    description?: string;
    priority?: number;
    link?: string;
    assignee?: string;
    attachments?: string[];
    zone?: number;
    status?: {id?: number, name?: string}
    statusId?: number;
    creator?: string;
    createDate?: number;
    updateDate?: number;
    threadId?: string;
}
