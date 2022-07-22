import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class IpService {

    private ipAddress: string = '';

    constructor(private http: HttpClient) {
        // this.http.get('http://api.ipify.org/?format=json').toPromise().then((res: any) => {
        //     this.ipAddress = res.ip;
        // });
    }

    public getIpAddress(): string {
        return this.ipAddress;
    }
}
