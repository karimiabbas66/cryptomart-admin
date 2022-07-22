import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {OwnerModel} from '../dto/owner.model';

@Injectable({
    providedIn: 'root'
})
export class OwnerService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllOwnerCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'owner/count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllOwner(page: number, size: number, searchTerm: string): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'owner/get-all';
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

    saveNewOwner(newGroup: OwnerModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'owner/save';
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

    getOwnerModel(fieldId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'owner/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    removeOwner(id: number): Promise<any> {
        return Observable.create(observer => {
            let targetUrl = `${this.endpoint}/owner/remove/${id}`;
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
                        observer.error(error);
                        observer.complete();
                    });
        }).toPromise();
    }

    getAllByBookId(bookId: number) {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'book-resource/owners-by-book-id';
            uri = uri + '?bookId=' + bookId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

    getAllArticleByArticleId(articleId: number) {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'article-resource/owners-by-article-id/' + articleId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

    getByJournalId(journalId: number) {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'journal-resource/owner-by-journal-id/' + journalId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getByMagazineId(magazineId: number) {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'magazine-resource/owner-by-magazine-id/' + magazineId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });

    }

}
