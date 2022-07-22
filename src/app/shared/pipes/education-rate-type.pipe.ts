import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'educationRateType'
})
export class EducationRateTypePipe implements PipeTransform {


    transform(value: any, args?: any): any {
        if (value) {
            if (value == 1) {
                return 'تحصیلی';
            } else if (value == 2) {
                return 'تدریسی';
            }
        } else {
            return '';
        }
    }

}
