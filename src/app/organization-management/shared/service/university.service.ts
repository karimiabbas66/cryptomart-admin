import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {EducationRate} from '../../university/model/education-rate';
import {extractDirectiveGuards} from '@angular/compiler-cli/src/ngtsc/metadata';
import {Banner} from '../../../cms/shared/dto/Banner';
import {EducationField} from '../../university/model/education-field';
import {FieldOrientation} from '../../university/model/field-orientation';
import {UnitType} from '../../university/model/unit-type';
import {Unit} from '../../university/model/unit';
import {PersonalEducations} from '../../../profile/shared/dto/PersonalEducations';

@Injectable({
    providedIn: 'root'
})
export class UniversityService {

    private endpoint: string = AppSettings.CORE_API_ENDPOINT;

    constructor(private http: HttpClient) {
    }

    public getAllEducationRate(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/degree/get-all';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findAllDegreeByTypeId(typeId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/typedegree/type/' + typeId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findAllTypeByDegreeId(degreeId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/typedegree/degree/' + degreeId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public findAllDegreeByTypeIdAndDegreeType(typeId: number, degreetype: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/typedegree/type?typeId=' + typeId + '&degreetype=' + degreetype;
            this.http.get(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public removeEducationRate(eduRateId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/degree?id=' + eduRateId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeEducationField(eduFieldId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/remove/' + eduFieldId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeUnitType(unitTypeId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/type?id=' + unitTypeId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public TypeDegree(typeId: number, degreeId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/typedegree?typeId=' + typeId + '&degreeId=' + degreeId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeUnit(unitId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unit?id=' + unitId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public removeFieldOrientation(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/orientation?id=' + id;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveEducationRate(item: EducationRate): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/degree';
            this.http.post(targetUrl, JSON.stringify(item), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllUnitByNameAndType(name: string, typeId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unit?name=' + name + '&typeId=' + typeId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });

    }

    public getFirstEducationGroup(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/group1';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });

    }

    public getSecondEducationGroup(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/group2';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getThirdEducationGroup(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/get-all?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getAllFields(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/find-all';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countAllField(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/count-all';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveField(item: EducationField): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field';
            this.http.post(targetUrl, JSON.stringify(item), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveLeafField(item: EducationField): Promise<any> {
        // return new Promise((resolve, reject) => {
        //   const targetUrl = this.endpoint + 'your Address';
        //   this.http.post(targetUrl, JSON.stringify(item), {
        //     headers: new HttpHeaders()
        //         .set('Content-Type', 'application/json')
        //   }).toPromise().then(data => {
        //     resolve(data);
        //   }, error => {
        //     reject(error);
        //   });
        // });
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'mock address';
            resolve('ok')
        });
    }

    public getSecondGroupFieldByParentId(parentId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/field/' + parentId;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });


    }

    public getOrientationListByFieldId(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/orientation/field/' + id;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveOrientation(item: FieldOrientation): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/orientation';
            this.http.post(targetUrl, JSON.stringify(item), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public saveUnitType(item: UnitType): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + '/api/univercity/type';
            this.http.post(targetUrl, JSON.stringify(item), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'your Address';
            resolve('ok')
        });
    }

    public saveUnit(item: Unit): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unit';
            this.http.post(targetUrl, JSON.stringify(item), {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getUnitTypeList(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/type/get-all';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public getUnitList(page, size): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unit/get-all?page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public savePersonalEducations(personalEducations: PersonalEducations): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/personal-edu';
            this.http.post(targetUrl, JSON.stringify(personalEducations), {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    public countUnit(): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unit/count';
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public findFieldByUnitId(unitId: number, page: number, size: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unitfield/get-fields?unitId=' + unitId + '&page=' + page + '&size=' + size;
            this.http.get(targetUrl, {
                headers: new HttpHeaders({'Content-Type': 'application/json'}),
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }


    public removeFieldFromUnit(unitId: number, fieldId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const targetUrl = this.endpoint + 'api/univercity/unitfield?unitId=' + unitId + '&fieldId=' + fieldId;
            this.http.delete(targetUrl, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }).toPromise().then(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }
}
