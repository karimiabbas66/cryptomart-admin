import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
    NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n, NgbCalendarPersian
} from '@ng-bootstrap/ng-bootstrap';
import {PersianCalendarService} from '../../services/persian-calendar.service';
import {JalaliDateCalculatorService} from 'ngx-persian';
import * as moment from 'moment-hijri';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
    'ذو القعدة', 'ذو الحجة'];
@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {

    getWeekdayShortName(weekday: number) {
        return WEEKDAYS[weekday - 1];
    }

    getMonthShortName(month: number) {
        return MONTHS[month - 1];
    }

    getMonthFullName(month: number) {
        return MONTHS[month - 1];
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
@Component({
    selector: 'islamic-date-picker',
    templateUrl: './islamic-date-picker.component.html',
    styleUrls: ['./islamic-date-picker.component.scss'],
    providers: [
        {provide: NgbCalendar, useClass: NgbCalendarIslamicCivil},
        {provide: NgbDatepickerI18n, useClass: IslamicI18n}
    ]
})
export class IslamicDatePickerComponent implements OnInit {

    @Input() public placeholder: string;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    private _epoch: number;
    @Input()
    set epochDate(epoch: number) {
        this._epoch = epoch;
        this.ngOnInit()
    }
    get epochDate() { return this._epoch; }
    model:any;
    minDate: NgbDateStruct = {year: 1200, month:1, day: 1};
    maxDate: NgbDateStruct = {year: 1499, month:1, day: 1};
    @Input()
    disableDatePicker: boolean;

    constructor(private formBuilder: FormBuilder,
                private persianCalendarService: PersianCalendarService,
                private jalaliService: JalaliDateCalculatorService,
                private calendar: NgbCalendar) {
    }

    selectToday() {
        this.model = this.calendar.getToday();
    }

    ngOnInit() {
        if (this.epochDate != null) {
            let date = new Date(this.epochDate);
            let res = moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate(), 'YYYY/M/D');
            this.model = {year: res.iYear(), month: res.iMonth()+1, day: res.iDate()}
        }
    }

    emitValue() {
        this.model = '';
        this.passEntry.emit(undefined);
    }

    checkResult() {
        if (this.model && this.model.year && this.model.year > 1200 && this.model.year < 1600 &&
            this.model.month && this.model.month > 0 && this.model.month < 13 && this.model.day && this.model.day > 0 && this.model.day < 32) {
            let s = moment(this.model.year+'/' + this.model.month +'/' + this.model.day, 'iYYYY/iM/iD');
            let format = s.format('YYYY/M/D');

            const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
            let m = a2e(format);
            console.log("m is: ", m)

            // let x = new Date(+m.split("/")[0], +m.split("/")[1], +m.split("/")[2]);
            let x = new Date(m.split("/")[0], m.split("/")[1]-1, m.split("/")[2]);
            this.passEntry.emit(x.getTime());
        } else {
            this.passEntry.emit(undefined);
        }
    }
}
