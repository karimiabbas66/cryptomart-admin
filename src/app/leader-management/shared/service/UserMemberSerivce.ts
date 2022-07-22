import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserEntity} from '../dto/UserEntity';

@Injectable({
    providedIn: 'root'
})
export class UserMemberSerivce {

    private userendpoint: string = AppSettings.USER_MANAGEMENT_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public addUserMemberEntity(userMemberEntity): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/addUserMember';
            this.http.post(targetUrl, JSON.stringify(userMemberEntity), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public deleteUserMemberEntity(userMemberEntityDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/delete';
            this.http.post(targetUrl, JSON.stringify(userMemberEntityDto), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findOtherUserMemberByEntityId(userId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccount/notmember/' + userId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
}
