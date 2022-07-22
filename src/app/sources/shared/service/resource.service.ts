import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {BookSearchModel} from '../dto/book-search.model';


@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    searchBook(from: number, page: number, bookModel?: BookSearchModel): Promise<any> {
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

    getBookModel(fieldId: string): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'book-resource/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getThesisModel(fieldId: string): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'thesis/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getArticleModel(fieldId: string): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'article-resource/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }


    searchCountBook(bookModel?: BookSearchModel): Promise<any> {
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

    searchCountMyLibrary(bookModel?: BookSearchModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'book-resource/count-my-library';
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

    searchBookMyLibrary(from: number, page: number, bookModel?: BookSearchModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'book-resource/get-all-my-library';
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
}
