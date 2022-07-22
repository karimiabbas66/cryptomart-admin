import {Pipe, PipeTransform} from '@angular/core';

const InstituteRankMap = new Map([
    ["0", "مربی"],
    ["1", "استادیار"],
    ["2", "دانشیاز"],
    ["3", "اسناد ممتاز"],
    ["4", "استاد تمام"],
    ["5", "استاد مقدمات"],
    ["6", "استاد سطح ۱"],
    ["7", "استاد سطوح عالی"],
    ["8", "استاد درس خارج"],
])

@Pipe({name: "instructorRankPipe"})
export class InstructorRankPipe implements PipeTransform{
    transform(value: number): any {
        let returnContext = InstituteRankMap.get(String(value));
        return returnContext != undefined ? returnContext : "تعریف نشده";
    }

}