import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'sheetReportType'
})
export class SheetReportTypePipe implements PipeTransform {


    transform(value: any, args?: any): any {
        if (value) {
            if (value == 1) {
                return 'تحلیل';
            } else if (value == 2) {
                return 'نقد';
            } else if (value == 3) {
                return 'گزارش خطا';
            } else if (value == 4) {
                return 'سایر';
            }
        } else {
            return '';
        }
    }

}
