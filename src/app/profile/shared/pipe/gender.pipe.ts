import {Pipe, PipeTransform} from '@angular/core';

const GenderMap = new Map([
    [1, "مرد"],
    [0, "زن"],
])

@Pipe({name: "genderPipe"})
export class GenderPipe implements PipeTransform{
    transform(value: any): any {
        let returnContent = GenderMap.get(value);
        return returnContent != undefined ? returnContent : "تعریف نشده";
    }
}
