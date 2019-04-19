import { Component, OnInit } from '@angular/core';

// Redux
import { select } from '@angular-redux/store';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

    @select() common;

    public showLoading: any;

    constructor() {}

    ngOnInit() {
        this.common.subscribe(data => {
            this.showLoading = data['showLoading'];
        });
    }

}
