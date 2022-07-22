import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'thesisAuthorType'
})
export class ThesisAuthorTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            if (value == 0) {
                return 'پدیدآور';
            } else if (value == 1) {
                return 'استاد راهنما';
            } else if (value == 2) {
                return 'استاد مشاور';
            }
        } else {
            return '';
        }
    }

}
