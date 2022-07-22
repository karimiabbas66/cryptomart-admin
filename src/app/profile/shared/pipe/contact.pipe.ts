import {Pipe, PipeTransform} from '@angular/core';

const contactTypeMap = new Map([
    ["EMAIL", "ایمیل"],
    ["PHONE", "تلفن"],
    ["MOBILE", "موبایل"],

])

@Pipe({name: "contactPipe"})
export class ContactPipe implements PipeTransform{
    transform(value: any): any {
        let returnContent = contactTypeMap.get(value);
        return returnContent != undefined ? returnContent : "تعریف نشده";
    }
}
