import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {AuthorModel} from '../dto/author.model';

@Injectable({
    providedIn: 'root'
})
export class AuthorService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllAuthorCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'author/count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllAuthor(page: number, size: number, searchTerm: string): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'author/get-all';
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

    saveNewAuthor(newGroup: AuthorModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'author/save';
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

    getAuthorModel(authorId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'author/' + authorId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    removeAuthor(id: number): Promise<any> {
        return Observable.create(observer => {
            let targetUrl = `${this.endpoint}/author/remove/${id}`;
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

    getAllAuthorType(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'author/get-all-types';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllArticleAuthorType(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'author/get-article-types';
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
            let uri = this.endpoint + 'book-resource/authors-by-book-id';
            uri = uri + '?bookId=' + bookId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

    getAllAuthorByArticle(articleId: number) {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'article-resource/authors-by-article-id/' + articleId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

}
