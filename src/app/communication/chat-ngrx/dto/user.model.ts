import {MessageModel} from './message.model';

export class UserModel {
    username?: string;
    id?: string;
    isActive?: boolean;
    messages?: MessageModel[] = []

    constructor(username: string, id: string, active: boolean) {
        this.username = username;
        this.id = id;
        this.isActive = active;
    }

}
