import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Redux
import { select } from '@angular-redux/store';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
  selector: 'app-money-punish',
  templateUrl: './money-punish.component.html',
  styleUrls: ['./money-punish.component.scss']
})
export class MoneyPunishComponent implements OnInit {

  @select() common;

    public moneyPunish: string = '';
    public errMsg: string = '';
    public successMsg: string = '';
    private key: string = '';

    constructor(
        public translate: TranslateService,
        public firebaseService: FirebaseService,
        public helperService: HelperService
    ) {

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getMoneyPunish();
    }

    /**
     * Function get money punish
     */
    async getMoneyPunish() {

        try {

            const result = await this.firebaseService.get('money_punish');
            if (result.length > 0) {
                this.moneyPunish = result[0]['money_punish'];
                this.key = result[0]['$key'];
            }

        } catch (e) {
            console.log(e);
        } finally {
            this.helperService.hideLoading();
        }

    }

    /**
     * Function validate money punish
     */
    validateMoneyPunish() {

        this.errMsg = '';
        this.successMsg = '';

        if (this.moneyPunish.trim() === '') {
            this.errMsg = this.translate.instant('MONEY_PUNISH_REQUIRED');
        } else if (this.helperService.isNumber(this.moneyPunish.trim())) {
            this.errMsg = this.translate.instant('MONEY_PUNISH_ONLY_NUMBER');
        } else {
            this.updateCode();
        }

    }

    /**
     * Function update money punish
     */
    async updateCode() {

        try {

            if (this.key === '') {

                await this.firebaseService.insert('money_punish', {
                    money_punish: this.moneyPunish.trim(),
                    created_at: new Date().getTime(),
                    updated_at: 0
                });

                this.successMsg = this.translate.instant('ADD_SUCCESS');

            } else {

                await this.firebaseService.updateWhereKey('money_punish', this.key, {
                    money_punish: this.moneyPunish.trim(),
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
