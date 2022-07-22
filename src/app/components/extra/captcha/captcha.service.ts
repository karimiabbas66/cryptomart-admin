import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {AppSettings} from '../../../pages/shared/AppSettings';

@Injectable({providedIn: 'root'})
export class CaptchaService {

    private endpoint: string = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }


    generateCaptcha(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'public/captcha?format=base64';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
                observe: 'response',
                responseType: 'text'
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });

        });
    }
}
