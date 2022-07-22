import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';
import {PersonalInformation} from '../../leader-management/shared/dto/PersonalInformation';
import {ProfileSearchDto} from '../../leader-management/shared/dto/ProfileSearchDto';

@Injectable({providedIn: 'root'})
export class ProfileListService {

    private page: number = 0;
    private size: number = 10;

    private endpoint = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public getProfiles(page = this.page, size = this.size): Promise<any> {
        return new Promise((resolve, reject) => {
            const api = this.endpoint + 'api/personal-info/get?page=' + page + '&size=' + size;
            this.http.get<PersonalInformation>(api, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getProfileCount(): Promise<any>{
        return new Promise((resolve, reject) => {
            const api = this.endpoint + 'api/personal-info/get/count';
            this.http.get<PersonalInformation>(api, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeProfile(id: number) {
        return new Promise((resolve, reject) => {
            const api = this.endpoint + 'api/profile/delete/' + id;
            this.http.get(api, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllByItems(profileSearchDto: ProfileSearchDto[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/personal-info/search/count';
            this.http.post(targetUrl,profileSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public searchAllProfiles(profileSearchDto: ProfileSearchDto[], page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/personal-info/search?page=' + page + '&size=' + size;
            this.http.post(targetUrl, profileSearchDto, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then((data) => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

}
