import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EducationalContentModel} from '../dto/educational-content.model';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {data} from '../../../shared/data/smart-data-table';

@Injectable({
    providedIn: 'root'
})
export class EducationalService {

    private endPoint = AppSettings.SOURCES_API_ENDPOINT + 'educational-content/';

    constructor(private httpClient: HttpClient) {
    }

    getAll(from: number, page: number): Promise<any> {
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

    getEducationalCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endPoint + 'count-all').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getEducationalById(educationalId: number): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endPoint + educationalId).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getReferenceByResource(resourceId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endPoint + 'reference-by-resource/' + resourceId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getReferenceByLesson(lessonId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endPoint + 'reference-by-lesson/' + lessonId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    saveNewConference(educationalContentModel: EducationalContentModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endPoint + 'save';
            this.httpClient.post(url, JSON.stringify(educationalContentModel), {
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




