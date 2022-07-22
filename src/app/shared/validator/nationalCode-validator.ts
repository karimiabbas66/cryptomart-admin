import {FormControl} from '@angular/forms';

export function nationalCodeValidator(control: FormControl): {[key: string]: boolean} | null {
    if (control.value !== undefined) {
        if (!/^\d{10}$/.test(control.value)) {
            return { 'notValidNational': true };
        }
        const check = Number(control.value[9]);

        const sum =
            Array.from({length: 9}, (_, i) => Number(control.value[i]) * (10 - i)).reduce(
                (x, y) => x + y,
            ) % 11;

        if(!(sum < 2 && check === sum) && !(sum >= 2 && check + sum === 11)){
            return { 'notValidNational': true };
        }

    }
    return null;
}
