import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {toPromise} from 'rxjs-compat/operator/toPromise';
import {data} from '../../../shared/data/smart-data-table';

@Injectable({
    providedIn: 'root'
})

export class CustomService{
    private endpoint: string = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public loadMyInput(): Promise<any>{
        return new Promise<any>((resolve, reject) => {
            const targetUrl = this.endpoint + 'myinput';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type':'application/json'})
            }).toPromise().then(data =>{
                resolve(data)
            }, error => {
                reject(error)
            })
        })
    }
}