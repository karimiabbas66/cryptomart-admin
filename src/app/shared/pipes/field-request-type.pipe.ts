import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fieldRequestType'
})
export class FieldRequestTypePipe implements PipeTransform {


    transform(value: any, args?: any): any {
        if (value) {
            if (value == "ADD_CHILD_TO_PARENT") {
                return 'اضافه کردن پدر جدید';
            } else if (value == "CREATE_NODE_AND_RELATION") {
                return 'ساخت نمایه جدید و اضافه کردن به پدر';
            }else if (value == "UPDATE_RELATION_NAME") {
                return 'به روزرسانی جنس ارتباط';
            }else if (value == "UPDATE_NAME_AND_KEYWORDS") {
                return 'به روزرسانی اطلاعات نمایه';
            }else if (value == "DELETE_RELATIONSHIP") {
                return 'حذف ارتباط';
            }else if (value == "DELETE_LEAF") {
                return 'حذف برگ';
            }
        } else {
            return '';
        }
    }

}
