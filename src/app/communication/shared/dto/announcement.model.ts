export class AnnouncementModel {
    id?: number;
    title?: string;
    createDate?: number;
    content?: string;
    creatorUserId?: string;
    targetUserIds?: string[];
    alarmType?: number;
    isRead?: boolean;
}
