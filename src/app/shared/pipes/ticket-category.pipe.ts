import {Injectable, Pipe, PipeTransform} from '@angular/core';

/*
  Generated class for the PersianDate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
    name: 'ticketCategory'
})

export class TicketCategoryPipe implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        if(value){
            if(value == '1'){
                return 'سوال';
            }else if(value == '2'){
                return 'انتقاد';
            }else if(value == '3'){
                return 'پیشنهاد';
            }else if(value == '4'){
                return 'سایر';
            }
        }
    }


}
