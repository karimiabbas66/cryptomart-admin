import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ThesisModel} from '../dto/thesis.model';
import {Observable} from 'rxjs';
import {SourceContentModel} from '../dto/source-content.model';

@Injectable({
    providedIn: 'root'
})

export class ThesisService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'thesis/';
    private mongoEndpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'mongo-thesis-sources/';

    constructor(private httpClient: HttpClient) {
    }

    getAllThesis(from: number, page: number, thesisModel?: ThesisModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'get-all';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            this.httpClient.post(uri, JSON.stringify(thesisModel), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getThesisCount(thesisModel?: ThesisModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'count';
            this.httpClient.post(uri, JSON.stringify(thesisModel), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getThesisModel(thesisId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const url = this.endpoint + thesisId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getInvolvedByThesisId(thesisId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const url = this.endpoint + 'get-involved-by-thesis/' + thesisId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getUniversityByThesisId(thesisId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const url = this.endpoint + 'get-university-by-thesis/' + thesisId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    saveNewThesisModel(thesisModel: ThesisModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'save';
            this.httpClient.post(url, JSON.stringify(thesisModel), {headers: new HttpHeaders().set('Content-Type', 'application/json')})
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    removeThesis(id: number): Promise<any> {
        return Observable.create(observer => {
            let url = `${this.endpoint}delete/${id}`;
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


    getThesisPageByPageNumber(resourceId: string, number: number) {
        return Promise.resolve().then(() => {
            const uri = this.mongoEndpoint + 'find-by-page/' + resourceId + '/' + number;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

    savePageInfo(sourceModel: SourceContentModel) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.mongoEndpoint + 'save';
            this.httpClient.post(targetUrl, JSON.stringify(sourceModel), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getThesisPageById(id: any) {
        return Promise.resolve().then(() => {
            const uri = this.mongoEndpoint + id;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }
}
