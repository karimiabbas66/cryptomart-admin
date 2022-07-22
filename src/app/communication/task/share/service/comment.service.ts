import {Injectable} from '@angular/core';
import {AppSettings} from '../../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewCommentModel} from '../model/newCommentModel';

@Injectable({providedIn: 'root'})
export class CommentService {
    private endpoint = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    getCommentsByTaskId(taskId: number): Promise<any> {
        let url = this.endpoint + 'comment/task/' + taskId;
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

    createNewCommentOnTask(comment: NewCommentModel) {

    }
}
