import {Injectable} from '@angular/core';
import {root} from 'rxjs/internal-compatibility';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AddAccessDto} from '../dto/AddAccessDto';

@Injectable({
    providedIn: 'root'
})
export class UserAccessService {
    private userendpoint: string = AppSettings.USER_MANAGEMENT_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public getAllOperations(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/operation ';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllAccessByUserId(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/operationAccess/' + userId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllPageAccessByUserId(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/pageAccesses';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllUserOperationAccesses(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/user/operationAccess'
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllUserOperationAccessById(userId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/user/operationAccess/'+userId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllGroupOperationAccessById(userEntityId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/group/operationAccess?userEntityId=' + userEntityId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public getAllAccessByUserEntityId(userEntityId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/operationAccess?userEntityId=' + userEntityId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public addAccessToUser(addAccessDto: AddAccessDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/userAccess/accesses'
            this.http.post(targetUrl, JSON.stringify(addAccessDto), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


}
