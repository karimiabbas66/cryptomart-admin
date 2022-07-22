
export class SaveCommentModel {
    threadId?: string;
    parentCommentId?: string;
    content?: string;
    userProfileId?: string;
    username?: string;
    pictureLinkId?: string;
    commentThreadVisibility?: boolean;
    commentVisibility?: boolean;
}

export class CommentModel {
    id?: string;
    content?: string;
    createDate?: number;
    userProfileId?: string;
    username?: string;
    pictureLinkId?: number;
    vote?: number;
    numberOfVote?: number;
    sumOfVote?: number;
    threadId?: string;
    parentId?: string;
    ancestorId?: string;
    attachment?: string;
    depth?: number;
    visibility?:  boolean;
}

export class CommentList {
    comment?: CommentModel;
    reply?: CommentList[];
}

export class CommentVoteModel {
    userProfileId?: string;
    commentId?: string;
    vote?: number;
}
