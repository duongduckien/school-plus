import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchGroup'
})
export class SearchGroupPipe implements PipeTransform {

    transform(arr: Array<any>, searchText: any) {
        if (searchText === null || searchText === '') {
            return arr;
        } else {
            console.log(arr);
            const tmpArr = [];

            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].group_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        tmpArr.push(arr[i]);
                    }
                }
            }

            console.log(tmpArr);

            // arr.forEach(element => {
            //     if (
            //         element.group_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
            //     ) {
            //         tmpArr.push(element);
            //     }
            // });
            return tmpArr;
        }
    }

}
