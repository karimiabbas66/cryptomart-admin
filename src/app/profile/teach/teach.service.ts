import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';


@Injectable({providedIn: 'root'})
export class TeachService {

    private endpoint = AppSettings.CORE_API_ENDPOINT;


    constructor(private http: HttpClient) {
    }

    getTeachesForProfile(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = this.endpoint + 'api/teach-info/profile-teaches/' + id;
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    addTeachToProfile(payload) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/teach-info/add';
            this.http.post(url, payload, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    deleteTeach(teaching_id) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/teach-info/delete/' + teaching_id;
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    getAllRanks(): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/rank/get';
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


}
