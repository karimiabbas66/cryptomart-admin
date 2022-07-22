import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import {NgbCalendar, NgbCalendarGregorian, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {PersianCalendarService} from '../../services/persian-calendar.service';


const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Auq', 'Sep', 'Oct', 'Nov', 'Dec'];


@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

    getWeekdayShortName(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
    getMonthShortName(month: number) { return MONTHS[month - 1]; }
    getMonthFullName(month: number) { return MONTHS[month - 1]; }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}

@Component({
    selector: 'gregorian-date-picker',
    templateUrl: './gregorian-date-picker.component.html',
    styleUrls: ['./gregorian-date-picker.component.scss'],

})
export class GregorianDatePickerComponent {

    @Input() public placeholder: string;
    private _epoch: number;

    @Input()
    set epochDate(epoch: number) {
        this._epoch = epoch;
        this.ngOnInit()
    }
    @Input()
    disableDatePicker: boolean;

    get epochDate() { return this._epoch; }

    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    model: any;

    constructor(private persianCalendarService: PersianCalendarService,
                private calendar: NgbCalendar) {
    }
    selectToday() {
        this.model = this.calendar.getToday();
    }
    ngOnInit() {
        if (this.epochDate != null) {
            let s = new Date(this._epoch);
            this.model = {year: +s.getFullYear(), month: +s.getMonth()+1, day: +s.getDate()}
        }
    }

    emitValue() {
        this.model = '';
        this.passEntry.emit(undefined);
    }

    checkResult() {
        if (this.model && this.model.year && this.model.year > 1200 && this.model.year < 2050 &&
            this.model.month && this.model.month > 0 && this.model.month < 13 && this.model.day && this.model.day > 0 && this.model.day < 32) {
            let x = new Date(this.model.year, this.model.month-1, this.model.day);
            console.log("model is: ", this.model)
            console.log("x is: ", x.getTime())
            this.passEntry.emit(x.getTime());
        } else {
            this.passEntry.emit(undefined);
        }
    }
}
