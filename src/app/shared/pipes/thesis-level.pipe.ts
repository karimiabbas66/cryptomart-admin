import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'thesisLevel'
})
export class ThesisLevelPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            if (value == 1) {
                return 'کارشناسی';
            } else if (value == 2) {
                return 'کارشناسی ارشد';
            } else if (value == 3) {
                return 'دکتری حرفه ای';
            } else if (value == 4) {
                return 'phd دکتری تحصصی';
            } else if (value == 5) {
                return 'سطح 3 حوزه علمیه';
            } else if (value == 6) {
                return 'سطح 4 حوزه علمیه';
            }
        } else {
            return '';
        }
    }

}
