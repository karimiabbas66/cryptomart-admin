import {Pipe, PipeTransform} from '@angular/core';

const MaritalMap = new Map([
    ["SINGLE", "مجرد"],
    ["MARRIED", "متاهل"],

])

@Pipe({name: "maritalPipe"})
export class MaritalPipe implements PipeTransform{
    transform(value: any): any {
        let returnContent = MaritalMap.get(value);
        return returnContent != undefined ? returnContent : "تعریف نشده";
    }
}
