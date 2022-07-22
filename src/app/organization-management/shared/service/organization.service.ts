import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {OrganizationModel} from '../dto/organization.model';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    private endpoint: string = AppSettings.CORE_API_ENDPOINT;
    private uploadEndpoint: string = AppSettings.UPLOAD_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllOrganizationCount(): Promise<any> {
        return Promise.resolve().then(() => {
            return this.httpClient.get(this.endpoint + 'organization/count').toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllOrganization(page: number, size: number, searchTerm: string): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'organization/get-all';
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

    saveNewOrganization(newGroup: OrganizationModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'organization/save';
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

    getOrganizationModel(fieldId: number): Promise<any> {
        return Promise.resolve().then(() => {
            const uri = this.endpoint + 'organization/' + fieldId;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    removeOrganization(id: number): Promise<any> {
        return Observable.create(observer => {
            let targetUrl = `${this.endpoint}/organization/remove/${id}`;
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
    getAllOrganizationType(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'organization/get-all-types';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }

    getAllOrganizationOwners(from: number, page: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'organization/get-all-owners';
            uri = uri + '?from=' + from;
            uri = uri + '&page=' + page;
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
