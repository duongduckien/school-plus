import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'pupilFilterAgent'
})
export class PupilFilterAgentPipe implements PipeTransform {

	transform(arr: Array<any>, groupsByAgent: any) {

		if (!groupsByAgent.length) {

			return null;

		} else {

			const tmpArr = [];

			arr.forEach(el => {

				for (let i = 0; i < groupsByAgent.length; i++) {

					if (
						el.group_class &&
						el.group_class['$key'] &&
						groupsByAgent[i]['$key'] === el.group_class['$key']
					) {
						tmpArr.push(el);
						break;
					}

				}

			});
			
			return tmpArr;

		}

	}

}
