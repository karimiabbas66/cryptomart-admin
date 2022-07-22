import {Component, OnInit} from '@angular/core';
import {TicketItemList} from '../shared/TicketItemList';
import {ProfileSearchDto} from '../../../leader-management/shared/dto/ProfileSearchDto';
import {TicketService} from '../shared/ticket.service';
import {MessageService} from 'primeng/api';
import {TicketSearchDto} from '../shared/TicketSearchDto';

@Component({
    selector: 'app-ticket-list',
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
    searchResult: TicketItemList[] = [];
    totalRecords: any;
    result: TicketItemList = {};
    pageSize = 5;
    example: any;
    private _timer: any;
    searchMap = new Map();
    loading: boolean = false;
    profileSearchDto: ProfileSearchDto[] = [];
    showSearchPanel = false;
    ticketSearchDto: TicketSearchDto[] = [];
    categories = [];
    selectedCat: any;
    referTypes = [];
    stateOrRefer: any;


    constructor(private ticketService: TicketService) {
    }

    ngOnInit() {
        this.categories.push({id: 1, name: 'سوال'});
        this.categories.push({id: 2, name: 'انتقاد'});
        this.categories.push({id: 3, name: 'پیشنهاد'});
        this.categories.push({id: 4, name: 'سایر'});

        this.referTypes.push({id: 1, name: 'کاربر در انتظار پاسخ'});
        this.referTypes.push({id: 2, name: 'پاسخ داده شده'});
        this.referTypes.push({id: 3, name: 'ارجاع داده شده به شخص'});
        this.referTypes.push({id: 4, name: 'ارجاع داده شده به گروه'});
    }

    loadTickets(event: any) {
        if (event.sortField) {
            this.searchMap.set('sortField', event.sortField);
            this.searchMap.set('sortType', event.sortOrder);
        }
        this.searchTicket(event);
    }

    onchange(event: any, fieldName: string) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this.goForFilter(event, fieldName);
        }, 1000);
    }

    searchTicket(event: any) {
        this.loading = true;
        // this.profileSearchDto = [];
        // this.searchMap.forEach((value: any, key: any) => {
        //     if (value !== '') {
        //         this.profileSearchDto.push({key: key, value: value});
        //     }
        // })
        // this.ticketService.countAllByItems(this.profileSearchDto).then(value => {
        //   this.totalRecords = value;
        // this.ticketService.searchByItems(this.profileSearchDto, event.first/event.rows,event.rows).then((value1: any) => {
        //   this.searchResult = value1;
        //   this.loading = false;
        // }).catch(reason => {
        //   this.loading = false;
        // });
        if (this.ticketSearchDto !== null) {
            this.ticketService.countAllByItems(this.ticketSearchDto).then(res => {
                this.totalRecords = res;
                this.ticketService.searchByItems(this.ticketSearchDto, event.first / event.rows, event.rows).then(res => {
                    this.searchResult = res;
                })
            })
        } else {
            this.ticketService.countAllTicketParents().then(value => {
                this.totalRecords = value;
                this.ticketService.findAllTicketParents(event.first / event.rows, event.rows).then(res => {
                    this.searchResult = res;
                    console.log(this.searchResult)
                    this.loading = false;
                }).catch(reason => {
                    this.loading = false;
                })
            }).catch(reason => {
                this.loading = false;
            });
        }
    }

    goForFilter(event, fieldName) {
        this.searchMap.set(fieldName, event.target.value);
        let pageEvent: any = {};
        pageEvent.first = 0;
        pageEvent.rows = this.pageSize;
        this.searchTicket(pageEvent);
    }

    test(key, value) {
        if (key == 'categoryEnum') {
            value = this.categories.find(cat => cat.id = this.selectedCat).id;
            ;
        } else if (key == 'ticketState') {
            value = this.referTypes.find(ref => ref.id == this.stateOrRefer).id;
        }


        var searchItem = this.ticketSearchDto.filter(value => value.key == key);
        console.log(this.ticketSearchDto)
        if (searchItem.length > 0) {
            searchItem[0].value = value;
        } else {
            this.ticketSearchDto.push({key: key, value: value})
        }
    }

    onRefreshTable() {
        this.showSearchPanel = !this.showSearchPanel;
    }

    onSearchItems() {
        this.loading = true;
        this.ticketService.countAllByItems(this.ticketSearchDto).then(res => {
            console.log(res);
            this.totalRecords = res;
            // console.log('totalRec', this.totalRecords);
            if (this.totalRecords !== 0) {
                this.ticketService.searchByItems(this.ticketSearchDto, 0, this.pageSize).then(res => {
                    this.searchResult = res;
                    console.log('res', this.searchResult)
                    this.loading = false;
                })
            }
            this.loading = false;
        })
    }

}
