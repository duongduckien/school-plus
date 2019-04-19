import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
	selector: 'app-pupil-detail',
	templateUrl: './pupil-detail.component.html',
	styleUrls: ['./pupil-detail.component.scss']
})
export class PupilDetailComponent implements OnInit {

	public id: string = '';
	public pupilDetail: any = {};
	data: any;

	constructor(
		public route: ActivatedRoute,
		public firebaseService: FirebaseService,
        public helperService: HelperService,
	) {
		this.data = {
            labels: ['Đi học muộn', 'Đi học về sớm', 'Ăn thiếu bữa', 'Đi nghỉ muộn', 'Đi nghỉ về sớm'],
            datasets: [
                {
                    label: 'Biểu đồ rèn luyện',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 78, 18, 96, 55]
                }
            ]
        };
	}

	ngOnInit() {
		this.route.params.subscribe(res => {
			this.id = res['id'];
			this.getPupilDetail();
        });
	}

	async getPupilDetail() {
		try {
			 const result = await this.firebaseService.getWhere('pupils', 'id', this.id);
			 if (result.length > 0) {
				this.pupilDetail = result[0];
			 }
		} catch (e) {
			console.log(e);
		}
	}
}
