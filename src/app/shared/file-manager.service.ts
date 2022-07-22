import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../pages/shared/AppSettings';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  private endpoint: string = AppSettings.UPLOAD_API_ENDPOINT;

  constructor(private http: HttpClient) { }

  public saveBASE64File(content:any): Promise<any> {

    const imageName = 'name.png';
    const imageBlob = this.dataURItoBlob(content);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });

    const formData = new FormData();
    formData.append("safasf.png", imageFile);


    return new Promise((resolve, reject) => {
      const targetUrl = this.endpoint + 'api/upload?path=profile';
      this.http.post<any>(targetUrl, formData, {
        headers: new HttpHeaders(),reportProgress:true
      }).toPromise().then(data => {
        resolve(data.message);
      }, error => {
        reject(error);
      });
    });
  }

  dataURItoBlob(dataURI) {
    dataURI = dataURI.substr(dataURI.indexOf(',')+1, dataURI.length-1)
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/png'});
  }

  public findByUUID(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const targetUrl = this.endpoint + 'api/info/' + id;
      this.http.get(targetUrl, {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
      }).toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public getImage(uuid): Observable<Blob> {
    return this.http.get(this.endpoint + 'api/download/' + uuid, { responseType: 'blob' });
  }
}
