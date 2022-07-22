import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BookDetailsModel} from './book-details.model';
import {AppSettings} from '../../shared/AppSettings';


@Injectable({providedIn: 'root'})
export class BookDetailsService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }


    saveNewBookResource(bookResourceModel: BookDetailsModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'book-resource/save';
            this.http.post(targetUrl, JSON.stringify(bookResourceModel), {
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

    getTestList(pageNumber: number, size: number, searchTerm: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let targetUrl: string = `${this.endpoint}book-resource/table-test?size=` + size+`&page=`+pageNumber+`&searchTerm=`+searchTerm;
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
    getTestCount(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'book-resource/table-test-count';
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
