import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'pupilFilterGroup'
})
export class PupilFilterGroupPipe implements PipeTransform {

	transform(arr: Array<any>, group: any) {
		if (!group || !group['$key']) {
			return arr;
		} else {
			const tmpArr = [];
			arr.forEach(el => {
				if (
					el.group_class &&
					el.group_class['$key'] &&
					group['$key'] === el.group_class['$key']
				) {
					tmpArr.push(el);
				}
			});

			return tmpArr;
		}
	}
}
