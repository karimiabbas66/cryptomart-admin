import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {OwnerModel} from '../dto/owner.model';
import {BookModel} from '../dto/book.model';
import {SourceContentModel} from '../dto/source-content.model';
import {BookSearchModel} from '../dto/book-search.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllBookCount(bookModel?: BookSearchModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'book-resource/count';
            this.httpClient.post(uri, JSON.stringify(bookModel), {
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

    getAllBook(from: number, page: number, bookModel?: BookSearchModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'book-resource/get-all';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            this.httpClient.post(uri, JSON.stringify(bookModel), {
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

    saveNewBook(bookResourceModel: BookModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'book-resource/save';
            this.httpClient.post(targetUrl, JSON.stringify(bookResourceModel), {
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

    getBookModel(fieldId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'book-resource/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    removeBook(id: number): Promise<any> {
        return Observable.create(observer => {
            let targetUrl = `${this.endpoint}/book-resource/remove/${id}`;
            this.httpClient.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Accept', '*/*')
                    .set('Content-Type', 'application/json')
            })
                .subscribe(() => {
                        observer.next(true);
                        observer.complete();
                    },
                    error => {
                        observer.error(error.json());
                        observer.complete();
                    });
        }).toPromise();
    }

    getBookPage(bookResourceId: number, pageNumber: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'book-resource/get-page/' + bookResourceId + '/' + pageNumber;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getBookPageMongo(id: string): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'mongo-sources/' + id;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getBookPageById(id: string): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + '/mongo-sources/' + id;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getBookPageByPageNumber(resourceId: string, pageNumber: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + '/mongo-sources/find-by-page/' + resourceId + '/' + pageNumber;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    savePageInfo(sourceModel: SourceContentModel) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'mongo-sources/save';
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

}
