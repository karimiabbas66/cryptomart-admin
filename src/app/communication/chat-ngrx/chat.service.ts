import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {Observable} from 'rxjs';
import {AppSettings} from '../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ChatService {
    private endpoint: string = AppSettings.CORE_API_ENDPOINT;
    get targetUserId(): string {
        return this._targetUserId;
    }

    set targetUserId(value: string) {
        this._targetUserId = value;
    }
    private socket: any = null;
    // private readonly uri: string = 'http://localhost:8000'
    private readonly uri: string = 'http://185.110.191.48:8000'

    private _targetUserId: string;
    constructor(private http: HttpClient) {
        this.socket = io(this.uri,
            {
                query: `token=${localStorage.getItem('JWT_TOKEN')}&type=join`,
            }
        );

    }
    runIt()
    {
        this.socket = io(this.uri,
            {
                query: `token=${localStorage.getItem('JWT_TOKEN')}&type=join`,
            });
    }
    disconnect(){
        this.socket.disconnect();
    }

    getGroupInfo(groupId: any): Promise<any>{
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/chat/group-info/' + groupId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getGroupUsers(groupId: any): Promise<any>{
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/chat/group/' + groupId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    listen(eventName: string) {
        return new Observable(observer => {
            this.socket.on(eventName, (data) => {
                observer.next(data);
            });
        });
    };

    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }

}
