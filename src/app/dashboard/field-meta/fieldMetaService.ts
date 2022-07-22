import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';
import {FieldMeta} from './model/FieldMeta';
import {ChildDto} from './model/ChildDto';
import {DeleteRelationship} from './model/DeleteRelationship';

@Injectable({providedIn: 'root'})
export class FieldMetaService {

    private endpoint: string = AppSettings.FIELD_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public getFieldMetaById(fieldMetaId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/FieldMeta/' + fieldMetaId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getFieldById(fieldId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/' + fieldId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public searchFieldById(fieldId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/search?id=' + fieldId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public editKeywordsAndTitle(fieldMeta: FieldMeta): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/update';
            this.http.post(targetUrl, JSON.stringify(fieldMeta), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getChilds(id, skip, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/childs?nodeId=' + id + '&skip=' + skip + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getParents(id, skip, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/parents?nodeId=' + id + '&skip=' + skip + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });


    }

    public countParents(nodeId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/count-parents?nodeId=' + nodeId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countChild(nodeId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/count-childs?nodeId=' + nodeId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public deleteRelationShip(deleteRelationship: DeleteRelationship): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/relationship';
            this.http.post(targetUrl, deleteRelationship, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public addChildToParent(childDto: ChildDto): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/child'
            this.http.post(targetUrl, childDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public searchSuggestion(text: string, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/FieldMeta/title-keyword?title=' + text + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countSearchSuggestion(text: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/FieldMeta/countTitleAndKeyword?title=' + text;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findFirstDepthChildsByRelationName(parentId, relationName): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/get-first-child?parentId=' + parentId + '&relationName=' + relationName;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findSecondDepthChildsByRelationName(parentId, relationName): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/get-second-child?parentId=' + parentId + '&relationName=' + relationName;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findRoot(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/get-root';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getRelationShipsName(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/field/get-all-relationships';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


}




