import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtRequest} from '../../model/JwtRequest';
import {AppSettings} from '../../pages/shared/AppSettings';
import jwt_decode from 'jwt-decode';


@Injectable({providedIn: 'root'})
export class AuthService {


    private endpoint: string = AppSettings.CORE_API_ENDPOINT;
    constructor(private http: HttpClient) {
    }

    login(jwtRequest: JwtRequest): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            this.http.post(this.endpoint + 'api/login', jwtRequest).toPromise()
                .then((jwt:any) => {
                    localStorage.setItem('JWT_TOKEN', jwt.jwttoken);
                    resolve();
                }, (error) => {
                    reject(error);
                });
        });
        return promise;
    }

    private validateToken(jwt: string): boolean {
        let isValid;
        this.http
            .post(this.endpoint+'api/login', jwt).toPromise().then(value => {
            isValid = value;
        })
        return isValid;
    }

    getCurrentUser() {
        let jwtStore = localStorage.getItem('JWT_TOKEN');
        if (jwtStore) {
            return jwtStore;
        } else {
            return null;
        }
    }
    getCurrentUUID(): string{
        let jwtStore = localStorage.getItem('JWT_TOKEN');
        let claim:any = jwt_decode(jwtStore);
        return claim.UserId;
    }

    logout() {
        localStorage.removeItem('JWT_TOKEN');
    }

}
