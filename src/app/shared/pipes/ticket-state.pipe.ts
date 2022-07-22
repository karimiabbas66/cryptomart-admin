import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name : 'ticketState'
})

export class TicketStatePipe implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        if(value){
            if(value == 'SENT'){
                return 'کاربر در انتظار پاسخ';
            }else if(value == 'REFERRED'){
                return 'ارجاع داده شده';
            }else if(value == 'ANSWERED'){
                return 'پاسخ داده شده';
            }
        }
    }

}
