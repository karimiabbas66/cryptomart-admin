import {Injectable} from '@angular/core';
import {CommentModel, CommentVoteModel, SaveCommentModel} from './comment.model';
import {AppSettings} from '../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CommentService {
    private endpoint = AppSettings.COMMENT_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    submitComment(comment: SaveCommentModel):Promise<any> {
        let url = this.endpoint + 'comment-system/save-comment';
        return new Promise((resolve, reject) => {
            this.http.post(url, comment, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }

    getComments(threadId: string, page: number = 0, size: number = 100, isAdmin: boolean = true, commentVisibilityType: boolean = true): Promise<any> {
        let url = this.endpoint + 'comment-system/get-comment-list-by-threadId?' + 'threadId=' + threadId +
            '&page=' + page + '&size=' + size +
            '&isAdmin=' + isAdmin + '&commentVisibilityType=' + commentVisibilityType;
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

    voteOnComment(vote: CommentVoteModel) :Promise<any> {
        let url = this.endpoint + 'comment-system/save-comment-vote-by-id';
        return new Promise((resolve, reject) => {
            this.http.post(url, JSON.stringify(vote), {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(result => {
                resolve(result);
            }, error => {
                reject(error);
            });
        });
    }
}
