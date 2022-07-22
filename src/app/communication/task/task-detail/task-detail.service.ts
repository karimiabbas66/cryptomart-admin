import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LogWorkModel} from '../share/model/logWork.model';
import {TaskEditModel} from '../share/model/taskEdit.model';
import {AppSettings} from '../../../pages/shared/AppSettings';

@Injectable({providedIn: 'root'})
export class TaskDetailService {
    private endpoint = AppSettings.TASK_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    getTask(id: number): Promise<any> {
        let url = this.endpoint + 'task/' + id;
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

    getAllLogWorksForTask(taskId: number): Promise<any> {
        let url = this.endpoint + 'logWork/task/' + taskId;
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

    createLogWork(logWork: LogWorkModel) {
        let url = this.endpoint + 'logWork';
        return new Promise((resolve, reject) => {
            this.http.post(url, JSON.stringify(logWork), {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    deleteLogWork(logWorkId: number) {
        let url = this.endpoint + 'logWork/' + logWorkId;
        return new Promise((resolve, reject) => {
            this.http.delete(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(reject);
            });
        });
    }

    editTask(task: TaskEditModel) {
        let url = this.endpoint + 'task';
        return new Promise((resolve, reject) => {
            this.http.put(url, JSON.stringify(task), {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(reject);
            });
        })
    }

    deleteTask(id: number) {
        let url = this.endpoint + 'task/'+id;
        return new Promise((resolve, reject) => {
            this.http.delete(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(reject);
            });
        })
    }

    createTask(task: TaskEditModel) {
        task.statusId = 1;
        let url = this.endpoint + 'task';
        console.log("for create is: ", task)
        return new Promise((resolve, reject) => {
            this.http.post(url, JSON.stringify(task), {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(reject);
            });
        })
    }

}
