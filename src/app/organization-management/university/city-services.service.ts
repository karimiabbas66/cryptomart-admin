import {AppSettings} from '../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CityServices{
    private endpoint: string = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    getAllProvince(page,size){
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'province/get-all?page='+page+'&size='+size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    getByProvinceId(id){
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'city/province-id/'+id;
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
