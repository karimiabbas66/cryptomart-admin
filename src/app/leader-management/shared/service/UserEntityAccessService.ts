import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PersonalField} from '../dto/PersonalField';

@Injectable({
    providedIn: 'root'
})
export class UserEntityAccessService {

    private coreendpoint: string = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {

    }

    public save(personalField: PersonalField[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field';
            this.http.post(targetUrl, personalField, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findUserFieldsId(userEntity: string, title: string, page: number, size: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field/userFields?userEntity=' + userEntity + '&title=' + title + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findCurrentUserFieldsId(title: string, page: number, size: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field/currentUserFields?title=' + title + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findAnotherCurrentUserFieldsId(userEntity: string, title: string, page: number, size: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field/anotherCurrentUserFields?userEntity='+userEntity+'&title='+title +'&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countUserFields(userEntity: string, title: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field/countUserFields?userEntity=' + userEntity + '&title=' + title;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAnotherCurrentUserFields(userEntity: string, title: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field/countAnotherCurrentUserFields?userEntity=' + userEntity + '&title=' + title;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countCurrentUserFields(title: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field/countCurrentUserFields?title=' + title;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public deleteUserFieldAccess(userEntityId: number, fieldId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-field?userEntityId=' + userEntityId + '&fieldId=' + fieldId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


}
