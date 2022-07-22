import {Pipe, PipeTransform} from '@angular/core';

const educationTypesMap = new Map([
    ["university", "دانشگاهی"],
    ["hoze", "حوزوی"],

])

@Pipe({name: "educationTypePipe"})
export class EducationTypePipe implements PipeTransform{
    transform(value: any): any {
        let returnContent = educationTypesMap.get(value);
        return returnContent != undefined ? returnContent : "تعریف نشده";
    }
}
