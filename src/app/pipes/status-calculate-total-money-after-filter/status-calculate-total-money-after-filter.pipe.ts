import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusCalculateTotalMoneyAfterFilter'
})
export class StatusCalculateTotalMoneyAfterFilterPipe implements PipeTransform {

  transform(arr: Array<any>, searchText: any, totalMoneyPunish: number) {
    if (searchText === null || searchText === '') {
      return totalMoneyPunish;
    } else {
      let totalMoneyPunish = 0;
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
          totalMoneyPunish += el.total_money_punish;
        }
      });
      return totalMoneyPunish;
    }
  }
}
