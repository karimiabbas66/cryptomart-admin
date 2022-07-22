import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../../pages/shared/AppSettings';

@Injectable({
    providedIn: 'root'
})
export class CityService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllProvince(page: number, size: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'province-sources/get-all';
            uri = uri + '?page=' + page;
            uri = uri + '&size=' + size;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllCityByProvinceId(provinceId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'city-sources/province-id/' + provinceId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getProvinceByCityId(provinceId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'province-sources/city-id/' + provinceId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

}
