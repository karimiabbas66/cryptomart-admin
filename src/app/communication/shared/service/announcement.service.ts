import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class AnnouncementService {
    private endpoint: string = AppSettings.CORE_API_ENDPOINT;
    private uploadEndpoint: string = AppSettings.UPLOAD_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    sendSingleAnnouncement(announcementItem: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'user-inbox/save';
            this.http.post(targetUrl,JSON.stringify(announcementItem), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    sendToAllUsers(announcementItem: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'user-inbox/send-to-all-users';
            this.http.post(targetUrl,JSON.stringify(announcementItem), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
}
