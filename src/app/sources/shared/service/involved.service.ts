import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InvolvedModel} from '../dto/involved.model';
import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class InvolvedService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT + '/involve/';
    private journalEndpoint: string = AppSettings.SOURCES_API_ENDPOINT + '/journal-resource/';
    private magazineEndpoint: string = AppSettings.SOURCES_API_ENDPOINT + '/magazine-resource/';

    constructor(private httpClient: HttpClient) {
    }

    getInvolvedCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllInvolved(page: number, size: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'get-all';
            uri = uri + '?page=' + page;
            uri = uri + '&size=' + size;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getInvolvedModel(involvedId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + involvedId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    saveNewInvolved(newGroup: InvolvedModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'save';
            this.httpClient.post(targetUrl, JSON.stringify(newGroup), {
                headers: new HttpHeaders()
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
            })
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getAllInvolvedType(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'get-all-types';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getAllByJournalId(journalId: number) {
        return Promise.resolve().then(() => {
            let uri = this.journalEndpoint + 'involve-by-journal-id/' + journalId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

    getAllByMagazineId(magazineId: number) {
        return Promise.resolve().then(() => {
            let uri = this.magazineEndpoint + 'involve-by-magazine-id/' + magazineId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }


}
