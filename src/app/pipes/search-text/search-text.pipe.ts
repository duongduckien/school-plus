import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchText'
})
export class SearchTextPipe implements PipeTransform {

    transform(arr: Array<any>, searchText: any) {
        if (searchText === null || searchText === '') {
            return arr;
        } else {
            const tmpArr = [];
            arr.forEach(element => {
                if (
                    element.first_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                    || element.last_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                    || element.email.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                    || element.phone_number.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                ) {
                    tmpArr.push(element);
                }
            });
            return tmpArr;
        }
    }

}
