import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';
import {Access} from './personal.component';
import {Personal} from '../shared/dto/Personal';


@Injectable({providedIn: 'root'})
export class PersonalService {

    endpoint: string = AppSettings.CORE_API_ENDPOINT;
    cachedProfile = new Map();

    constructor(private http: HttpClient) {
    }

    getPersonalInformation(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/personal-info/get/' + id;
            if(!this.cachedProfile.get(id)){
                this.http.get(url).toPromise().then(data => {
                    this.cachedProfile.set(id, data);
                    resolve(data);
                }, error => {
                    reject(error);
                });
            } else {
                resolve(this.cachedProfile.get(id));
            }
        });
    }


    getAccess(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/personal-info/get/access/' + id;
            this.http.get(url).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    updateAccess(payload): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/personal-info/update/access'
            this.http.post(url, payload, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    updatePersonalInformation(payload: Personal) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/personal-info/update'
            this.http.post(url, payload, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data:any) => {
                this.cachedProfile.set(data.id, data);
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    updateMainPhone(person_id: string, number: string) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/personal-info/update/phone'
            this.http.post(url, {personalId: person_id, number: number}, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    addContact(personId, data) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/contact/create'
            this.http.post(url, {personId: personId, type: data.type, content: data.content}, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    deleteContact(contactId) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/contact/delete?id=' + contactId;
            this.http.get(url, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });

    }
}
