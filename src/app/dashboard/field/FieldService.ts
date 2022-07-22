import {AppSettings} from '../../pages/shared/AppSettings';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FieldRelationDto} from '../field-meta/model/FieldRelationDto';
import {DeleteLeaf} from '../field-meta/model/DeleteLeaf';

@Injectable({providedIn: 'root'})
export class FieldService {

    private endpoint: string = AppSettings.FIELD_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public fieldDepth(fieldId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + '/api/field/field-depth/?fieldId='+ fieldId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countByName(name){
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + '/api/field/count/?name=' +name;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }



    public filterByFieldName(name, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/name/?name=' + name + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public deleteLeaf(deleteLeaf:DeleteLeaf): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/deleteLeaf';
            this.http.post(targetUrl, deleteLeaf,{
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public addNewField(field): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/newnode' ;
            this.http.post(targetUrl, JSON.stringify(field),{
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public updateRelation(fieldRelationDto:FieldRelationDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/update/relation' ;
            this.http.post(targetUrl, JSON.stringify(fieldRelationDto),{
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
    public createNodeWithReturnId(field): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/create-node' ;
            this.http.post(targetUrl, JSON.stringify(field),{
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

}
