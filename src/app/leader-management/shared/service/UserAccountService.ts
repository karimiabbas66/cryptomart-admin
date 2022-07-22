import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnableDto} from '../dto/EnableDto';
import {ProfileSearchDto} from '../dto/ProfileSearchDto';

@Injectable({
    providedIn: 'root'
})
export class UserAccountService {

    private coreendpoint: string = AppSettings.CORE_API_ENDPOINT;
    private userendpoint: string = AppSettings.USER_MANAGEMENT_API_ENDPOINT;

    constructor(private http: HttpClient) {

    }

    public searchByItems(profileSearchDto: ProfileSearchDto[], page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/search/advisor?' + 'page=' + page + '&size=' + size;
            this.http.post(targetUrl, profileSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findByUserIds(userIds:string[],page,size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info?userIds='+userIds+'&page='+page+'&size'+size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllByItems(profileSearchDto: ProfileSearchDto[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/search/advisor/count';
            this.http.post(targetUrl,profileSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllLeaders(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/get/advisor?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllLeaders(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/get/advisor/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public updateActivity(enableDto: EnableDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/update/activity';
            this.http.post(targetUrl, enableDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveUserEntity(userAccount): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/create';
            this.http.post(targetUrl, JSON.stringify(userAccount), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public forgotPassword(forgotPassword): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccount/forgotPassword';
            this.http.post(targetUrl, JSON.stringify(forgotPassword), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllUsers(profileSearchDto: ProfileSearchDto[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/search/user/count';
            this.http.post(targetUrl,profileSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public searchAllUsers(profileSearchDto: ProfileSearchDto[], page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.coreendpoint + 'api/personal-info/search/user?' + 'page=' + page + '&size=' + size;
            this.http.post(targetUrl, profileSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

}
