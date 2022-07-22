import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../../../pages/shared/AppSettings';


@Injectable({providedIn: 'root'})
export class TaskStatusService {
    private endpoint = AppSettings.TASK_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    getAllTaskStatus(): Promise<any> {
        let url = this.endpoint + 'task-status';
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

}
