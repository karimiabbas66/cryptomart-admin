import {Component, OnInit} from '@angular/core';
import {SheetReportListItem} from './share/model/sheet-report-list-item';
import {ProfileSearchDto} from '../../leader-management/shared/dto/ProfileSearchDto';
import {Router} from '@angular/router';
import {ReportSheetService} from './share/service/report-sheet.service';

@Component({
    selector: 'app-sheet-report-list',
    templateUrl: './sheet-report-list.component.html',
    styleUrls: ['./sheet-report-list.component.scss']
})
export class SheetReportListComponent implements OnInit {
    searchResult: SheetReportListItem[] = [];
    totalRecords: any;
    result: SheetReportListItem = {};
    pageSize: any = 5;
    example: any = {};
    searchMap = new Map();
    private _timer: any;
    loading: boolean;
    profileSearchDto: ProfileSearchDto[] = [];

    constructor(private router: Router,
                private reportService: ReportSheetService) {
    }

    ngOnInit() {
    }

    loadReports(event: any) {
        this.loading = true;
        this.profileSearchDto = [];
        this.searchMap.forEach((value: any, key: any) => {
            if (value !== '') {
                this.profileSearchDto.push({key: key, value: value});
            }
        })
        this.reportService.countAll().then(value => {
            this.totalRecords = value;
            this.reportService.findAll( event.first / event.rows, event.rows)
                .then((value1: SheetReportListItem[]) => {
                    this.searchResult = value1;
                    this.loading = false;
                }).catch(reason => {
                this.loading = false;
            });
        })
        // let x: SheetReportListItem = {};
        // x.id = 12;
        // x.sheetTitle = 'sheet'
        // x.disLikeCount = 20;
        // x.status = false;
        // this.totalRecords=1;
        // this.searchResult.push(x);
        // x.type=1;
    }

    onchange(event: any, fieldName: string) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this.goForFilter(event, fieldName);
        }, 1000);
    }

    goForFilter(event, fieldName) {
        this.searchMap.set(fieldName, event.target.value);
        const pageEvent: any = {};
        pageEvent.first = 0;
        pageEvent.rows = this.pageSize;
        this.loadReports(pageEvent);
    }

    checkForReturn(item: any) {
        console.log('selected item is: ', item)
        this.router.navigate(['/sources/sheet-report-detail'], {queryParams: {id: item.id}});
    }
}
