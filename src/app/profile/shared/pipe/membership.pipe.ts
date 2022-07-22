import {Pipe, PipeTransform} from '@angular/core';

const MemberShipMap = new Map([
    ["VISITING_PROFESSOR", "استاد مدعو"],
    ["FACULTY_MEMBER", "هیئت علمی"]
]);

@Pipe({name: "memberShipPipe"})
export class MembershipPipe implements PipeTransform{
    transform(value: string): string {
        let returnContext = MemberShipMap.get(value);
        return returnContext != undefined ? returnContext : "تعریف نشده";
    }
}