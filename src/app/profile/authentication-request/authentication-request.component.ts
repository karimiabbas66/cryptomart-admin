import {Component, OnInit} from '@angular/core';
import {AuthenticationListItemRequestDto} from './share/model/authentication-list-item-request-dto';
import {AuthenticationRequestService} from './share/service/AuthenticationRequest.service';
import {ProfileSearchDto} from '../../leader-management/shared/dto/ProfileSearchDto';
import {Router} from '@angular/router';

@Component({
    selector: 'app-authentication-request',
    templateUrl: './authentication-request.component.html',
    styleUrls: ['./authentication-request.component.scss']
})
export class AuthenticationRequestComponent implements OnInit {
    searchResult: AuthenticationListItemRequestDto[] = [];
    totalRecords: any;

    searchMap = new Map();
    loading: boolean;
    profileSearchDto: ProfileSearchDto[] = [];
    example: any = {};
    private _timer: any;
    pageSize = 5;
    result: AuthenticationListItemRequestDto={};

    constructor(private authReqService: AuthenticationRequestService,
                private router: Router) {
    }

    ngOnInit() {
    }


    onchange(event: any, fieldName: string) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this.goForFilter(event, fieldName);
        }, 1000);
    }

    loadProfiles(event) {
        this.searchProfile(event);
    }
    customSort(event: any) {
    }

    goForFilter(event, fieldName) {
        this.searchMap.set(fieldName, event.target.value);
        const pageEvent: any = {};
        pageEvent.first = 0;
        pageEvent.rows = this.pageSize;
        this.searchProfile(pageEvent);
    }


    searchProfile(event: any) {
        this.loading = true;
        this.profileSearchDto = [];
        this.searchMap.forEach((value: any, key: any) => {
            if (value !== '') {
                this.profileSearchDto.push({key: key, value: value});
            }
        })
        this.authReqService.countByUsers(this.profileSearchDto).then(value => {
            this.totalRecords = value;
            this.authReqService
                .searchByUsers(this.profileSearchDto, event.first / event.rows, event.rows)
                .then((value1: AuthenticationListItemRequestDto[]) => {
                this.searchResult = value1;
                this.loading = false;
            }).catch(reason => {
                this.loading = false;
            });
        })
    }

    checkForReturn(item: any) {
        console.log("selected item is: ", item)
        this.router.navigate(['/profile/authentication-request-detail'], {queryParams: {id: item.id}});
    }
}
