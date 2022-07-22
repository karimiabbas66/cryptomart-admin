import {MessageModel} from './message.model';

export class GroupModel {
    name?: string
    id?: string
    messages?: MessageModel[] = []
    ownerId?: string


    constructor(name: string, id: string, ownerId: string = null) {
        this.name = name
        this.id = id
        this.ownerId = ownerId
    }

}
