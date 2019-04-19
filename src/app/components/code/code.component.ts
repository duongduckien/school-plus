import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Redux
import { select } from '@angular-redux/store';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
    selector: 'app-code',
    templateUrl: './code.component.html',
    styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {

    @select() common;

    public code: string = '';
    public errMsg: string = '';
    public successMsg: string = '';
    private key: string = '';
    private lengthMastercode: number;

    constructor(
        public translate: TranslateService,
        public firebaseService: FirebaseService,
        public helperService: HelperService
    ) {

        this.common.subscribe(data => {
            this.lengthMastercode = data['globalConfig']['validate']['lengthMatercode'];
        });

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getMasterCode();
    }

    /**
     * Function get master code
     */
    async getMasterCode() {

        try {

            const result = await this.firebaseService.get('mastercode');

            if (result.length > 0) {
                this.code = result[0]['code'];
                this.key = result[0]['$key'];
            }

        } catch (e) {
            console.log(e);
        } finally {
            this.helperService.hideLoading();
        }

    }

    /**
     * Function validate master code
     */
    validateCode() {

        this.errMsg = '';
        this.successMsg = '';

        if (this.code.trim() === '') {
            this.errMsg = this.translate.instant('MASTERCODE_REQUIRED');
        } else if (this.helperService.isNumber(this.code.trim())) {
            this.errMsg = this.translate.instant('MASTERCODE_ONLY_NUMBER');
        } else if (this.code.trim().length !== this.lengthMastercode) {
            this.errMsg = this.translate.instant('MASTERCODE_LENGTH', { number: this.lengthMastercode });
        } else {
            this.updateCode();
        }

    }

    /**
     * Function update master code
     */
    async updateCode() {

        try {

            if (this.key === '') {

                await this.firebaseService.insert('mastercode', {
                    code: this.code.trim(),
                    created_at: new Date().getTime(),
                    updated_at: 0
                });

                this.successMsg = this.translate.instant('ADD_SUCCESS');

            } else {

                await this.firebaseService.updateWhereKey('mastercode', this.key, {
                    code: this.code.trim(),
                    updated_at: new Date().getTime()
                });

                this.successMsg = this.translate.instant('UPDATE_SUCCESS');

            }

            setTimeout(() => {
                this.successMsg = '';
            }, 1500);

        } catch (e) {
            this.errMsg = this.translate.instant('SOMETHING_WENT_WRONG');
            console.log(e);
        }

    }

}
