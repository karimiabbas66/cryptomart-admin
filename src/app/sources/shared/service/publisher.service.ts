import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {PublisherModel} from '../dto/publisher.model';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';

@Injectable({
    providedIn: 'root'
})
export class PublisherService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;
    private uploadEndpoint: string = AppSettings.UPLOAD_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllPublisherCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'publisher/count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllPublisher( page: number, size: number, searchTerm: string): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'publisher/get-all';
            uri = uri + '?page=' + page;
            uri = uri + '&size=' + size;
            if (searchTerm != null && searchTerm != '') {
                uri = uri + '&searchTerm=' + searchTerm;
            }
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    saveNewPublisher(newGroup: PublisherModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'publisher/save';
            this.httpClient.post(targetUrl, JSON.stringify(newGroup), {
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

    getPublisherModel(fieldId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'publisher/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    removePublisher(id: number): Promise<any> {
        return Observable.create(observer => {
            let targetUrl = `${this.endpoint}/publisher/remove/${id}`;
            this.httpClient.delete(targetUrl,{headers: new HttpHeaders()
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
            })
                .subscribe(() => {
                        observer.next(true);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    });
        }).toPromise();
    }
    getAllPublisherType(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'publisher/get-all-types';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllByBookId(bookId: number) {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'book-resource/publishers-by-book-id';
            uri = uri + '?bookId=' + bookId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

    public getImage(uuid): Observable<Blob> {
        return this.httpClient.get(this.uploadEndpoint + 'api/download/' + uuid, { responseType: 'blob' });
    }
}
