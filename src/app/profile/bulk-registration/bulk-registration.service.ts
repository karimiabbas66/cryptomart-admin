import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';
import {BulkRequestDto} from './dto/bulk-request-dto';
import {BulkRegistrationRequestMetaDataDto} from '../bulk-registration-report-list/dto/BulkRegistrationRequestMetaDataDto';


@Injectable({providedIn: 'root'})
export class BulkRegistrationService {

    endpoint: string = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    sendBulkRegistrationRequest(request: BulkRequestDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/bulk-register-request'
            this.http.post(url, request, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllRequests(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/bulk-register-request/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public loadAllRequests(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/bulk-register-request?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getMetaById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/bulk-register-request/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findMetaDataById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/file-meta/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllRequestsDetailById(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/file-log/count?fileUUID=' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public loadAllRequestsDetailById(id, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/file-log?fileUUID=' + id + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
}
