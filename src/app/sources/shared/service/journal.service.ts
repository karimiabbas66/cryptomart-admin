import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JournalModel} from '../dto/journal.model';
import {Observable} from 'rxjs';
import {JournalNumberModel} from '../dto/journal-number.model';

@Injectable({
    providedIn: 'root'
})
export class JournalService {
    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'journal-resource/';

    constructor(private httpClient: HttpClient) {
    }

    getAllJournal(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'get-all';
            url = url + '?from=' + from;
            url = url + '&page=' + page;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getAllJournalsCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalModel(journalId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const url = this.endpoint + journalId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalInvolved(journalId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'involve-by-journal-id/' + journalId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalContact(journalId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'contact-by-journal-id/' + journalId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getInvolvedType(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'find-all-involved-type';
            url = url + '?from=' + from;
            url = url + '&page=' + page;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalScores(journalId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'find-journal-score/' + journalId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalNumbersCount(journalId: number): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'count-journal-number/' + journalId).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalNumbersByJournalId(journalId: number, from: number, page: number): Promise<any> { // , sortBy: string
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'find-numbers-by-journal';
            url = url + '?journalId=' + journalId;
            url = url + '&from=' + from;
            url = url + '&page=' + page;
            // url = url + '&sortBy=' + sortBy;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getJournalNumberById(journalNumberId: number): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'find-journal-number/' + journalNumberId).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            })
        })
    }

    saveNewJournalNumber(journalNumber: JournalNumberModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'save-number/' + journalNumber.journalsResourceId;
            this.httpClient.post(url, JSON.stringify(journalNumber), {headers: new HttpHeaders().set('Content-Type', 'application/json')})
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    saveNewJournalModel(journalModel: JournalModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'save';
            this.httpClient.post(url, JSON.stringify(journalModel), {headers: new HttpHeaders().set('Content-Type', 'application/json')})
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    removeJournal(id: number): Promise<any> {
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

    removeJournalNumber(id: number): Promise<any> {
        return Observable.create(observer => {
            this.httpClient.delete(`${this.endpoint}delete-journal-number/${id}`, {
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
