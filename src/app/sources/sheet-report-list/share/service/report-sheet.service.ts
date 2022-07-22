import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {SheetReportListItem} from '../model/sheet-report-list-item';

@Injectable({
    providedIn: 'root'
})
export class ReportSheetService {
    private sources: string = AppSettings.SOURCES_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public findById(reportId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/' + reportId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public findAllByResearchSheetId(sheetId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/researchSheet/' + sheetId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public countAllByResearchSheetId(sheetId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/researchSheet/count/' + sheetId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findAllByCreatedBy(personalId: string, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources +
                'api/report-research-sheet/created-by?personalId=' + personalId + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllByCreatedBy(personalId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/created-by/' + personalId + '/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public changeStatus(reportResearchSheet: SheetReportListItem): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/change-status';
            this.http.post(targetUrl, reportResearchSheet, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public deleteById(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/' + id;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public like(reportId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/like/' + reportId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public disLike(reportId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/disLike/' + reportId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
    public findAll(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveComment(reportId, commentId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.sources + 'api/report-research-sheet/comment?reportId=' + reportId + '&commentId=' + commentId;
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
