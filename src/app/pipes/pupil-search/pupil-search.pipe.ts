import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pupilSearch'
})

export class PupilSearchPipe implements PipeTransform {

    transform(arr: Array<any>, searchText: any) {
        if (searchText === null || searchText === '') {
            return arr;
        } else {
            const tmpArr = [];
            arr.forEach(el => {
                if (typeof el.id === 'undefined') {
                    el.id = '';
                }
                if (typeof el.first_name === 'undefined') {
                    el.first_name = '';
                }
                if (typeof el.last_name === 'undefined') {
                    el.last_name = '';
                }
                if (typeof el.sex === 'undefined') {
                    el.sex = '';
                }
                if (typeof el.date_of_birth === 'undefined') {
                    el.date_of_birth = '';
                }
                if (typeof el.mother_mobile === 'undefined') {
                    el.mother_mobile = '';
                }
                if (
                    el.id.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || (el.last_name + ' ' + el.first_name).toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || el.sex.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || el.date_of_birth.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || el.father_mobile.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                    || el.mother_mobile.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
                ) {
                    tmpArr.push(el);
                }
            });
            return tmpArr;
        }
    }

}
