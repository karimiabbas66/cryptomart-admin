import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConferenceModel} from '../dto/conference.model';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConferenceService {

    private endPoint = AppSettings.SOURCES_API_ENDPOINT + 'conference/';

    constructor(private httpClient: HttpClient) {
    }

    getAllConference(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endPoint + 'get-all';
            url = url + '?from=' + from;
            url = url + '&page=' + page;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getConferenceCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endPoint + 'count-all').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getConferenceById(conferenceId: number): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endPoint + conferenceId).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    // getConferenceOrganization(conferenceId: number): Promise<any> {
    //     return Promise.resolve().then(() => {
    //         return this.httpClient.get(this.endPoint + 'organization-by-conference/' + conferenceId).toPromise().then(data => {
    //             return data;
    //         }).catch(error => {
    //             return error;
    //         });
    //     });
    // }

    saveNewConference(conferenceModel: ConferenceModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endPoint + 'save';
            console.log('saved obj in service :::::::::', conferenceModel);
            this.httpClient.post(url, JSON.stringify(conferenceModel), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    removeConference(conferenceId: number): Promise<any> {
        return Observable.create(observer => {
            let url = `${this.endPoint}delete/${conferenceId}`;
            this.httpClient.delete(url, {
                headers: new HttpHeaders()
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
            }).subscribe(() => {
                observer.next(true);
                observer.complete();
            }, error => {
                observer.error(error.json());
                observer.complete();
            });
        }).toPromise();
    }

}
