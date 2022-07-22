import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {AuthorModel} from '../dto/author.model';

@Injectable({
    providedIn: 'root'
})
export class SourceTypeService {

    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private httpClient: HttpClient) {
    }

    getAllSourceType(page: number, size: number): Promise<any> {
        return Promise.resolve().then(() => {
            let uri = this.endpoint + 'source-type/get-all';
            uri = uri + '?page=' + page;
            uri = uri + '&size=' + size;
            return this.httpClient.get(uri).toPromise().then(data => {
                return data;
            }).catch(error => {
                return error;
            });

        });
    }
}
