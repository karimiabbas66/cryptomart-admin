export class NewCommentModel {
    taskId?: number;
    threadId?: number;
    parentCommentId?: number;
    content?: string;
    userProfileId?: number;
    username?: string;
    pictureLinkId?: number;
    commentThreadVisibility?: boolean;
    commentVisibility?: boolean;
}

