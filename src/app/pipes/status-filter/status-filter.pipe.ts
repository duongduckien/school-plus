import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(arr: Array<any>, searchText: any) {
    if (searchText === null || searchText === '') {
        return arr;
    } else {
        const tmpArr = [];
        arr.forEach(el => {
            if (typeof el.first_name === 'undefined') {
                el.first_name = '';
            }
            if (typeof el.last_name === 'undefined') {
                el.last_name = '';
            }
            if (
                (el.last_name + ' ' + el.first_name).toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
            ) {
                tmpArr.push(el);
            }
        });
        return tmpArr;
    }
}

}
