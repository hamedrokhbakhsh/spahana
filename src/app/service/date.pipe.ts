import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment-jalaali';
moment.loadPersian({dialect: 'persian-modern',usePersianDigits: false});

@Pipe({
    name: 'dateFormat',
})
export class DateFormat implements PipeTransform {

    transform(value: any, args?: any) {
        if (value) {
            return moment(new Date(value)).utc().format(args ? args : 'jYYYY/jMM/jDD    HH:mm:ss');
        }
        return null;
    }
}
