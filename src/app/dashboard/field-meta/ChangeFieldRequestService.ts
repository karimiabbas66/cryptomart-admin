import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FieldRelationDto} from './model/FieldRelationDto';
import {ChangeRequestStatus} from './model/ChangeRequestStatus';
import {AppSettings} from '../../pages/shared/AppSettings';

@Injectable({providedIn: 'root'})
export class ChangeFieldRequestService {

    private endpoint: string = AppSettings.FIELD_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public changeStatus(changeRequestStatus: ChangeRequestStatus): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/changeFieldRequest/changeStatus';
            this.http.post(targetUrl, changeRequestStatus, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAll(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/changeFieldRequest?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
    public countAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/changeFieldRequest/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }



}