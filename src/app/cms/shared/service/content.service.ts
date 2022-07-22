import {Injectable} from '@angular/core';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Banner} from '../dto/Banner';
import {Observable} from 'rxjs';
import {News} from '../dto/News';
import {StaticPage} from '../dto/StaticPage';
import {Logo} from '../dto/Logo';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private endpoint: string = AppSettings.CORE_API_ENDPOINT;
    private uploadEndpoint: string = AppSettings.UPLOAD_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public loadAllBanners(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'banners/get-all?firstIndex=' + page + '&maxResult=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public loadAllStaticPages(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'static-pages/get-all?firstIndex=' + page + '&maxResult=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findBannerById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'banners/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findPageById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'static-pages/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllBanners(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'banners/get-all/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public loadAllNews(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/get-all?firstIndex=' + page + '&maxResult=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findNewsById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveBanner(banner: Banner): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'banners/save';
            this.http.post(targetUrl, JSON.stringify(banner), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveStaticPage(staticPage: StaticPage): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'static-pages/save';
            this.http.post(targetUrl, JSON.stringify(staticPage), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveNews(news: News): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/save';
            this.http.post(targetUrl, JSON.stringify(news), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json'), reportProgress: true
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllNews(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/get-all/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public newsLikeUsers(newsId, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/newsLike?newsId=' + newsId + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countNewsLikeUsers(newsId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/count/newsLike?newsId=' + newsId ;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countNewsDisLikeUsers(newsId): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/count/newsLike?newsId=' + newsId ;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public newsDisLikeUsers(newsId, page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/newsDisLike?newsId=' + newsId + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllStaticPages(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'static-pages/get-all/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeBanner(bannerId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'banners/delete/' + bannerId;
            this.http.post(targetUrl, null, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeNews(newsId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'news/delete/' + newsId;
            this.http.post(targetUrl, null, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeStaticPage(newsId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'static-pages/delete/' + newsId;
            this.http.post(targetUrl, null, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    // public downloadFile(uuid): Promise<any> {
    //   return new Promise((resolve, reject) => {
    //     const targetUrl = this.uploadEndpoint + 'api/download/' + uuid;
    //     let headers = new HttpHeaders({
    //       'Content-Type': 'application/octet-stream'
    //     });
    //     this.http.get(targetUrl, {
    //       headers: headers, responseType: 'blob'})
    //         .toPromise().then(data => {
    //       resolve(data);
    //     }, error => {
    //       reject(error);
    //     });
    //   });
    // }

    public getImage(uuid): Observable<Blob> {
        return this.http.get(this.uploadEndpoint + 'api/download/' + uuid, {responseType: 'blob'});
    }

    public getFileInfo(uuid): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.uploadEndpoint + 'api/info/' + uuid;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    loadAllLogos(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'logos/get-all?firstIndex=' + page + '&maxResult=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    countAllLogos(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'logos/get-all/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    removeLogo(logoId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'logos/delete/' + logoId;
            this.http.post(targetUrl, null, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveLogo(logo: Logo): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'logos/save';
            this.http.post(targetUrl, JSON.stringify(logo), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    findLogoById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'logos/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
}
