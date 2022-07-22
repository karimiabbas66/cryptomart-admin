import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MagazineModel} from '../dto/magazine.model';
import {Observable} from 'rxjs';
import {MagazineNumberModel} from '../dto/magazine-number.model';

@Injectable({
    providedIn: 'root'
})
export class MagazineService {
    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT + 'magazine-resource/';

    constructor(private httpClient: HttpClient) {
    }

    getAllMagazine(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'get-all/';
            url = url + '?from=' + from;
            url = url + '&page=' + page;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getAllMagazineCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getMagazineModel(magazineId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const url = this.endpoint + magazineId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getMagazineInvolved(magazineId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'involve-by-magazine-id/' + magazineId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getMagazineContact(magazineId: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'contact-by-magazine-id/' + magazineId;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getMagazineNumbersCount(magazineId: number): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'count-magazine-number/' + magazineId).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getMagazineNumbersByMagazineId(magazineId: number, from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let url = this.endpoint + 'find-numbers-by-magazine';
            url = url + '?magazineId=' + magazineId;
            url = url + '&from=' + from;
            url = url + '&page=' + page;
            return this.httpClient.get(url).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });
        });
    }

    getMagazineNumberById(magazineNumberId: number): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'find-magazine-number/' + magazineNumberId).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            })
        })
    }

    saveNewMagazineNumber(magazineNumber: MagazineNumberModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'save-magazine-number/' + magazineNumber.magazineResourceId;
            this.httpClient.post(url, JSON.stringify(magazineNumber), {headers: new HttpHeaders().set('Content-Type', 'application/json')})
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    saveNewMagazineModel(magazineModel: MagazineModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'save-magazine';
            this.httpClient.post(url, JSON.stringify(magazineModel), {headers: new HttpHeaders().set('Content-Type', 'application/json')})
                .toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    removeMagazine(id: number): Promise<any> {
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

    removeMagazineNumber(id: number): Promise<any> {
        return Observable.create(observer => {
            this.httpClient.delete(`${this.endpoint}delete-magazine-number/${id}`, {
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
