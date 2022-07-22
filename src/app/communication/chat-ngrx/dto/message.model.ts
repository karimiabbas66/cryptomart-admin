export class MessageModel {
    id?: number;
    message?: string;
    fromUserId?: string;
    toUserId?: string;
    side?: string;
    time?: number;
    type?: string;
    uuid?: string;

    constructor(id?: number, message?: string, fromUserId?: string, toUserId?: string, time?: number, type?: string, uuid?: string) {
        this.id = id;
        this.message = message;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.time = time;
        this.type = type;
        this.uuid = uuid;
    }

}
