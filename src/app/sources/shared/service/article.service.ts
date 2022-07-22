import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {SourceContentModel} from '../dto/source-content.model';
import {ArticleModel} from '../dto/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'article-resource/';
    private mongoEndpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'mongo-article-sources/';
    private bookEndpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'book-resource/';

    constructor(private httpClient: HttpClient) {
    }


    getAllArticleCount(articleSearchModel?: ArticleModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'count';
            this.httpClient.post(uri, JSON.stringify(ArticleModel), {
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

    getAllArticle(from: number, page: number, articleSearchModel?: ArticleModel): Promise<any> {
        return new Promise((resolve, reject) => {
            let uri = this.endpoint + 'get-all';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            this.httpClient.post(uri, JSON.stringify(articleSearchModel), {
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

    getArticleReference(from: number, to: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.bookEndpoint + 'get-all-referenced';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + to;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getArticleReferenceCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.bookEndpoint + 'count-book-reference')
                .toPromise().then(data => {
                    return data;
                }).catch(error => {
                    return error;
                })
        })
    }

    getArticleReferenceByArticleId(articleId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'reference-by-article-id/' + articleId;
            return this.httpClient.get(url)
                .toPromise().then(data => {
                    return data;
                }).catch(error => {
                    return error;
                })
        })
    }

    saveNewArticle(articleResourceModel: ArticleModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'save';
            this.httpClient.post(targetUrl, JSON.stringify(articleResourceModel), {
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

    getArticleModel(fieldId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    removeArticle(id: number): Promise<any> {
        return Observable.create(observer => {
            let targetUrl = `${this.endpoint}delete/${id}`;
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

    // getKeywordsByArticleId(articleId:number): Promise<any>{
    //
    // }

    getArticlePageById(id: string): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.mongoEndpoint + id;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getArticlePageByPageNumber(resourceId: string, pageNumber: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.mongoEndpoint + 'find-by-page/' + resourceId + '/' + pageNumber;
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

}
