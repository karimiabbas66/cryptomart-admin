import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../pages/shared/AppSettings';
import {ActivatedRoute} from '@angular/router';
import {PersonalEducations} from '../shared/dto/PersonalEducations';

@Injectable({providedIn: 'root'})
export class EducationService {

    private endpoint = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    getEducationInformation(id: string, degreeType): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = this.endpoint + 'api/personal-edu?id=' + id + '&degreeType=' + degreeType;
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    deleteEducationInformation(personalEducations: PersonalEducations): Promise<any> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return new Promise((resolve, reject) => {
            let url = this.endpoint + 'api/personal-edu/delete';
            this.http.post(url, personalEducations, httpOptions
            ).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    getEducationsForProfile(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = this.endpoint + 'api/edu-info/getEdu/' + id;
            this.http.get(url, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    getEducationTypes(): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/edu-type/get';
            this.http.get(url, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    removeEducationFromProfile(id) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/edu-info/delete-from/' + id;
            this.http.get(url, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }

    addEducationInformationToProfile(profile_id, education_id) {
        return new Promise((resolve, reject) => {
            const url = this.endpoint + 'api/edu-info/addTo';
            const payload = {
                profileId: profile_id,
                typeId: education_id
            }
            this.http.post(url, payload, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        })
    }


}
