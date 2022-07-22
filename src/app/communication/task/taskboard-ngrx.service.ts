import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';
import {TaskSearchDto} from './share/model/TaskSearchDto';

@Injectable({providedIn: 'root'})
export class TaskBoardService {
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

    editTaskStatus(taskId, statusId) {
        let url = this.endpoint + 'task/change-status';
        return new Promise((resolve, reject) => {
            this.http.post(url, {taskId: taskId, statusId: statusId},{
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getTaskByStatusId(taskStatusId: number, page: number) : Promise<any> {
        let url = this.endpoint + 'task/status?'+ "id=" + taskStatusId + "&page=" + page;
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

    public searchByItems(taskSearchDto: TaskSearchDto[], taskStatusId: number, page): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'task/search?' + 'statusId=' + taskStatusId +  '&page=' + page;
            this.http.post(targetUrl, taskSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    getMyAssigneeTask(taskStatusId: number, page: number) : Promise<any> {
        let url = this.endpoint + '/task/my-assignee-task?'+ "id=" + taskStatusId + "&page=" + page;
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

    getMyCreatedTask(taskStatusId: number, page: number) : Promise<any> {
        let url = this.endpoint + '/task/my-created-task?'+ "id=" + taskStatusId + "&page=" + page;
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
