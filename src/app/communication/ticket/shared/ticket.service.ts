import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfileSearchDto} from '../../../leader-management/shared/dto/ProfileSearchDto';
import {data} from '../../../shared/data/smart-data-table';
import {tick} from '@angular/core/testing';
import {TicketSearchDto} from './TicketSearchDto';


@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private endpoint: string = AppSettings.CORE_API_ENDPOINT;
    private uploadEndpoint: string = AppSettings.UPLOAD_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }


    public countAllByItems(ticketSearchDto: TicketSearchDto[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/search-parents/count';
            this.http.post(targetUrl, ticketSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public searchByItems(ticketSearchDto: TicketSearchDto[], page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/search-parents?' + 'page=' + page + '&size=' + size;
            this.http.post(targetUrl, ticketSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    getAllByParentId(ticketParentId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/get-all-by-parent-id?' + 'parentId=' + ticketParentId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getByParentId(ticketParentId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/get-by-parent-id?' + 'parentId=' + ticketParentId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getAllTicketsByParentId(ticketParentId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/get-all-tickets-by-parent-id?' + 'parentId=' + ticketParentId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    replyToUser(ticketItem: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/reply-to-user?' + 'innerId=' + ticketItem.innerId;
            this.http.post(targetUrl,JSON.stringify(ticketItem), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getAdminId(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/get-admin-id';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getImage(uuid): Observable<Blob> {
        return this.http.get(this.uploadEndpoint + 'api/download/' + uuid, { responseType: 'blob' });
    }

    findAllTicketParents(page, size): Promise<any>{
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/get-all-ticket-parents?' + 'page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    countAllTicketParents(): Promise<any>{
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/get-all-ticket-parents/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    closeTicketParent(id: any) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/close-ticket-parent/' + id;
            this.http.post(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    markAsUnread(ticketParentId: any) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'ticket/admin/mark-as-unread/' + ticketParentId;
            this.http.post(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
}
