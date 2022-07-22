import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OperationService {

    private userendpoint: string = AppSettings.USER_MANAGEMENT_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public getAllOperations(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.userendpoint + 'api/operation/get-all';
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
