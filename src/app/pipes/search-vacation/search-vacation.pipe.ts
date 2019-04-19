import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchVacation'
})
export class SearchVacationPipe implements PipeTransform {

    transform(arr: Array<any>, searchText: any) {
        if (searchText === null || searchText === '') {
            return arr;
        } else {
            const tmpArr = [];
            arr.forEach(element => {
                if (
                    element.vacation_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                ) {
                    tmpArr.push(element);
                }
            });
            return tmpArr;
        }
    }

}
