import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'timeDurationPipe'})
export class TimeConverterPipe implements PipeTransform {

    private hour = 0;
    private minutes = 0;

    transform(value: number): any {
        this.hour = Math.floor(value / 60);
        this.minutes = value % 60;

        if (this.hour != 0) {
            return `${this.hour} ساعت و ${this.minutes} دقیقه `;
        } else {
            return `${this.minutes} دقیقه `;
        }
    }
}
