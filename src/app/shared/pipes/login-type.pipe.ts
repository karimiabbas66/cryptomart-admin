import { Injectable, Pipe } from '@angular/core';
import {PersianCalendarService} from '../services/persian-calendar.service';

/*
  Generated class for the PersianDate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
    name: 'loginTypePipe'
})
@Injectable()
export class LoginTypePipe {
    /**
     *
     */
    constructor() {

    }
    /*
      Takes a value and convert it to 
     */
    transform(value: number) {
        if(value){
            if(value == 1){
                return 'عمومی';
            } else if(value == 2){
                return 'اعضا';
            }
        } else return '';
    }
}
