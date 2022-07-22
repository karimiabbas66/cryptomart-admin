import {Injectable} from '@angular/core';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationRequestDto} from '../model/AuthenticationRequestDto';
import {ProfileSearchDto} from '../../../../leader-management/shared/dto/ProfileSearchDto';


@Injectable({providedIn: 'root'})
export class AuthenticationRequestService {

    private endpoint = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    changeStatus(authenticationRequestDto: AuthenticationRequestDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/change-status';
            this.http.post(targetUrl, JSON.stringify(authenticationRequestDto), {
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

    findAll(page: number, size: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
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

    countAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/count';
            this.http.get(targetUrl, {
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

    findAllByPersonalId(page: number, size: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/personalId?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
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

    countAllByPersonalId(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/personalId/count';
            this.http.get(targetUrl, {
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


    deleteById(id: any) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/' + id;
            this.http.delete(targetUrl, {
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


    searchByUsers(searchDto: ProfileSearchDto[], page, size) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/search/user-request?page=' + page + '&size=' + size;
            this.http.post(targetUrl, searchDto, {
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

    countByUsers(searchDto: ProfileSearchDto[]) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/search/user-request/count';
            this.http.post(targetUrl, searchDto, {
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

    findById(id: any) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/authenticate-request/' + id;
            this.http.get(targetUrl, {
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
