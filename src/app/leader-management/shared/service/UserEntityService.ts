import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserEntity} from '../dto/UserEntity';

@Injectable({
    providedIn: 'root'
})
export class UserEntityService {
    private userendpoint: string = AppSettings.USER_MANAGEMENT_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }


    public saveUserEntity(userEntity: UserEntity): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/save';
            this.http.post(targetUrl, JSON.stringify(userEntity), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findUserEntityByUserId(userId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/' + userId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findAllUserEntityByUserId(userId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/userEntities/' + userId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findGroupUserEntityByUserId(userId: number,page,size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/group/' + userId+'?page='+page+'&size='+size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countGroupUserEntityByUserId(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/count/group/' + userId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllGroupByName(usertype,name, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/usertypeAndName?userType=' + usertype + '&name=' + name +'&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllGroupByName(usertype: string,name:string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/count-usertype?userType=' + usertype +'&name=' + name ;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public updateUserEntityById(userentity: UserEntity): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/update';
            this.http.post(targetUrl, JSON.stringify(userentity), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public deleteGroup(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/' + id;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public findMembersByUserEntityId(id: number,page,size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/members/' + id + '?page='+page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countMembersByUserEntityId(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userentity/count/members/' + id;
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
