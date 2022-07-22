import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SaveCommentModel} from '../../../shared/comment/comment.model';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {ResearchSheetDto} from '../dto/ResearchSheetDto';
import {ResearchSheetRateDto} from '../dto/ResearchSheetRateDto';
import {TableResourceSheetDto} from '../dto/TableResourceSheetDto';
import {ResearchSheetItems} from '../dto/ResearchSheetItems';


@Injectable({
    providedIn: 'root'
})
export class ResearchSheetService {
    private endpoint: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    save(bookResearchSheetDto: ResearchSheetDto): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/save';
        return new Promise((resolve, reject) => {
            this.http.post(url, bookResearchSheetDto, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    submit(bookResearchSheetDto: ResearchSheetDto): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/submit';
        return new Promise((resolve, reject) => {
            this.http.post(url, bookResearchSheetDto, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    rate(researchSheetRateDto: ResearchSheetRateDto): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/rate';
        return new Promise((resolve, reject) => {
            this.http.post(url, researchSheetRateDto, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }


    getContent(researchSheetId: string): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/content/' + researchSheetId;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
                responseType: 'text'
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    findAllByPersonalId(page: number, size: number): Promise<any> {
        let url = this.endpoint + 'api/research-sheet?page=' + page + '&size=' + size;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    countAllByPersonalId(): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/count';
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }


    countAllVisitsByResearchSheetId(researchSheetId): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/count/visit/' + researchSheetId;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    findAllByResourceIdAndPersonalId(resourceSheetId): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/' + resourceSheetId;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    findByItems(resourceId, fromBookPage, toBookPage, page, size): Promise<any> {
        let url = this.endpoint + 'api/research-sheet-relation/find-by-items?resourceId=' + resourceId + '&fromBookPage=' + fromBookPage
        '&toBookPage=' + toBookPage + '&page=' + page + '&size' + size;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    countByItems(resourceId, fromBookPage, toBookPage): Promise<any> {
        let url = this.endpoint + 'api/research-sheet-relation/count-by-items?resourceId=' + resourceId + '&fromBookPage=' + fromBookPage
        '&toBookPage=' + toBookPage;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }


    findAllRelationsByResearchSheetId(researchSheetId): Promise<any> {
        let url = this.endpoint + 'api/research-sheet-relation/' + researchSheetId;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }



    addToTable(tableResourceSheetDto: TableResourceSheetDto): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/table';
        return new Promise((resolve, reject) => {
            this.http.post(url, tableResourceSheetDto, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    findSheetByTableId(tableId, page, size): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/table/' + tableId + '?page=' + page + '&size=' + size;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    countAllSendTableByResourceSheetId(resourceSheetId): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/count/table/' + resourceSheetId;
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    countResourceSheetByTableId(tableId): Promise<any> {
        let url = this.endpoint + 'api/research-sheet/table/' + tableId + '/count/';
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    generalSearch(researchSheetItems: ResearchSheetItems) {
        let url = this.endpoint + 'api/research-sheet/search';
        return new Promise((resolve, reject) => {
            this.http.post(url, researchSheetItems, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    deleteResearchSheet(researchSheetId) {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/research-sheet/' + researchSheetId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


}
