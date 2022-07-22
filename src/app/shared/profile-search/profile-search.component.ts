import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {NgbdSortableHeader, SortEvent} from '../../components/bootstrap/tables/sortable.directive';
import {Personal} from '../../profile/shared/dto/Personal';
import {UserAccountService} from '../../leader-management/shared/service/UserAccountService';
import {ProfileSearchDto} from '../../leader-management/shared/dto/ProfileSearchDto';
import {PersonalInformation} from '../../leader-management/shared/dto/PersonalInformation';
import {LazyLoadEvent} from 'primeng/api';

@Component({
    selector: 'app-profile-search',
    templateUrl: './profile-search.component.html',
    styleUrls: ['./profile-search.component.scss']
})

export class ProfileSearchComponent implements OnInit {
    nationalCode: string;
    name: string;
    family: string;
    username: string;
    mainPhone: string;
    searchResult: Personal[] = [];
    result: Personal[] = [];
    selectAll: boolean = false;
    showCollapseText = false;
    @Input()
    searchText = 'انتخاب عضو';
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    selected: Personal[] = [];
    loading: boolean = true;
    profileSearchDto: ProfileSearchDto[] = [];
    sortField: string = '';
    sortOrder: number;
    totalRecords: any;
    searchMap = new Map();
    pageSize = 5;
    @Output() final = new EventEmitter<Personal[]>();

    @Input()
    multiple = true;
    example: any = {};

    @Input()
    isAdmin = true;

    modalReference: NgbModalRef;
    closeResult: any;

    constructor(public modalService: NgbModal,
                private personalInfoService: UserAccountService) {
    }

    ngOnInit() {
    }

    event: any;
    private _timer: any;

    onchange(event: any, fieldName: string) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this.goForFilter(event, fieldName);
        }, 1000);
    }

    openSearch(content) {
        this.example = {};
        this.result = [];
        this.searchMap = new Map();
        this.profileSearchDto = [];
        this.searchMap.set('sortField', 'createDate');
        this.searchMap.set('sortType', -1);

        let event: LazyLoadEvent = {};
        event.first = 0;
        event.rows = this.pageSize;

        this.modalReference = this.modalService.open(content, {size: 'lg', backdrop: 'static'});
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {

        });
    }


    searchProfile(event: any) {
        this.loading = true;
        this.profileSearchDto = [];
        this.searchMap.forEach((value: any, key: any) => {
            if (value !== '') {
                this.profileSearchDto.push({key: key, value: value});
            }
        })
        if(this.isAdmin){
            this.personalInfoService.countAllByItems(this.profileSearchDto).then(value => {
                this.totalRecords = value;
                this.personalInfoService.searchByItems(this.profileSearchDto, event.first / event.rows, event.rows).then((value1: PersonalInformation[]) => {
                    this.searchResult = value1;
                    this.loading = false;
                }).catch(reason => {
                    this.loading = false;
                });
            }).catch(reason => {
                this.loading = false;
            });
        }else {
            this.personalInfoService.countAllUsers(this.profileSearchDto).then(value => {
                this.totalRecords = value;
                this.personalInfoService.searchAllUsers(this.profileSearchDto, event.first / event.rows, event.rows).then((value1: PersonalInformation[]) => {
                    this.searchResult = value1;
                    this.loading = false;
                }).catch(reason => {
                    this.loading = false;
                });
            })
        }
    }

    customSort(event: any) {
    }

    getResults() {
        this.final.emit(this.result);
        this.modalReference.close();
    }

    goForFilter(event, fieldName) {
        this.searchMap.set(fieldName, event.target.value);
        let pageEvent: any = {};
        pageEvent.first = 0;
        pageEvent.rows = this.pageSize;
        this.searchProfile(pageEvent);
    }

    loadProfiles(event) {
        if (event.sortField) {
            this.searchMap.set('sortField', event.sortField);
            this.searchMap.set('sortType', event.sortOrder);
        }
        this.searchProfile(event);
    }

    checkForReturn(item: any) {
        if (this.multiple === true) {
            // no thing
        } else {
            this.result = [];
            this.result.push(item);
            this.final.emit(this.result);
            this.modalReference.close();
        }
    }
}
