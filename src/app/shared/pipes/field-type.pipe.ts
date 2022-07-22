import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fieldType'
})
export class FieldTypePipe implements PipeTransform {


    transform(value: any, args?: any): any {
        if (value) {
            if (value == 1) {
                return 'علمی';
            } else if (value == 2) {
                return 'پژوهشی';
            }
        } else {
            return '';
        }
    }

}
