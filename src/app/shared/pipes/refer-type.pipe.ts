import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name : 'referType'
})

export class ReferTypePipe implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        if(value){
            if(value == 'REFERRED_TO_ADMIN'){
                return 'ارجاع داده شده به ادمین';
            }else if(value == 'REFERRED_TO_GROUP'){
                return 'ارجاع داده شده به گروه';
            }
        }
    }
}
