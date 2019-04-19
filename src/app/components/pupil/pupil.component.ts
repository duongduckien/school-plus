import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as QRCode from 'qrcodejs2';
import { Router } from '@angular/router';

// Redux
import { select } from '@angular-redux/store';
import { PUPILS_DATA, PUPIL_SEARCH, SHOW_PUPIL_MODAL, SET_PUPIL_MODAL_TYPE, SET_PUPIL_KEY_FOR_EDIT } from '../../common/actions';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';
import { UploadService } from '../../services/upload/upload.service';
import { CommonService } from '../../services/common.service';
import { RelationService } from '../../services/relation/relation.service';

@Component({
    selector: 'app-pupil',
    templateUrl: './pupil.component.html',
    styleUrls: ['./pupil.component.scss']
})
export class PupilComponent implements OnInit {

    @select() pupil;

    public pupilsSelected: any = [];
    public pupilsData: any = [];
    public searchText: string = '';

    constructor(
        public uploadService: UploadService,
        public commonService: CommonService,
        public firebaseService: FirebaseService,
        public helperService: HelperService,
        public translate: TranslateService,
        public relationService: RelationService,
        public router: Router
    ) {

        if (!this.helperService.checkPermissionAccess('pupils')) {
            this.router.navigate(['/']);
        }

        this.pupil.subscribe(data => {
            this.pupilsSelected = data['pupilsSelected'];
            this.pupilsData = data['pupilsData'];
        });

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getListPupils();
    }

    /**
     * Function get list pupils
     */
    async getListPupils() {

        try {

            let result = await this.firebaseService.get('pupils');
            result = await this.relationService.getRelationOfPupils(result);
            this.helperService.dispatchToRedux(PUPILS_DATA, result);

            // Handle after QR code show complete
            setTimeout(() => {
                this.helperService.hideLoading();
            }, 1000);

        } catch (e) {
            this.helperService.hideLoading();
            console.log(e);
        }

    }

    /**
     * Function search text
     */
    onChangePupilSearch(event) {
        this.helperService.dispatchToRedux(PUPIL_SEARCH, event);
    }

    /**
     *  Function show or hide modal for add pupil
     */
    showModalPopup() {
        this.helperService.dispatchToRedux(SHOW_PUPIL_MODAL, true);
        this.helperService.dispatchToRedux(SET_PUPIL_KEY_FOR_EDIT, '');
        this.helperService.dispatchToRedux(SET_PUPIL_MODAL_TYPE, {
            type: 'addPupil',
            data: ''
        });
    }

    /**
     * Function print id card
     */
    printIdCard() {

        const arrSelected = [];

        // Get list pupils selected
        if (this.pupilsData.length > 0) {
            for (let i = 0; i < this.pupilsData.length; i++) {
                if (this.pupilsSelected.indexOf(this.pupilsData[i]['$key']) > -1) {
                    arrSelected.push(this.pupilsData[i]);
                }

                if (arrSelected.length === this.pupilsSelected.length) {
                    break;
                }
            }
        }

        let content = ``;

        if (arrSelected.length > 0) {
            for (let i = 0; i < arrSelected.length; i++) {

                // Create base64 data
                const idPupil = arrSelected[i]['id'].toString();
                const div = document.createElement('div');
                const qrCode = new QRCode(div, {
                    text: idPupil,
                    width: 128,
                    height: 128,
                    colorDark : '#000000',
                    colorLight : '#ffffff'
                });

                // Get base64 data from canvas
                const canvas = div.getElementsByTagName('canvas');
                const base64Data = canvas[0].toDataURL('image/png');

                content += `
                    <div class="col-sm-4">
                        <div class="wrap-print">
                            <div class="print-header">
                                <p class="id">ID: ${arrSelected[i]['id']}</p>
                                <p>Groupe: 3-6 ans</p>
                            </div>

                            <p class="name">${arrSelected[i]['last_name']}, ${arrSelected[i]['first_name']}</p>

                            <div class="image">
                                <div class="avatar">
                                    <img class="img-responsive" src="${arrSelected[i]['avatar_url']}">
                                </div>

                                <div class="qr-code">
                                    <img src="${base64Data}"/>
                                </div>
                            </div>

                            <div class="text-content">
                                <div class="left-content">
                                    <div>
                                        <p class="title">Mobile Papa</p>
                                        <p>${arrSelected[i]['father_mobile']}</p>
                                    </div>

                                    <div>
                                        <p class="title">Mobile Mama</p>
                                        <p>${arrSelected[i]['mother_mobile']}</p>
                                    </div>
                                </div>

                                <div class="right-content">
                                    <div>
                                        <p class="title">Allergies</p>
                                        <p>${arrSelected[i]['allergies']}</p>
                                    </div>

                                    <div class="wrap-column">
                                        <div class="col-5">
                                            <p class="title">Date </p>
                                            <p>${arrSelected[i]['date_of_birth']}</p>
                                        </div>

                                        <div class="col-7">
                                            <p class="title">Tuteur: </p>
                                            <p>${arrSelected[i]['tutor']}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style="padding-right: 5px; padding-left: 5px">
                                <p class="title">Address:</p>
                                <p style="margin: 0">${arrSelected[i]['home_address']}</p>
                            </div>
                        </div>
                    </div>
                `;

                qrCode.clear();

            }
        }

        let popupWin;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                    <title>Print tab</title>
                    <link rel="stylesheet" type="text/css" href="assets/css/print.css">
                    <link rel="stylesheet" type="text/css" href="assets/css/theme.css">
                    <link rel="stylesheet" type="text/css" href="assets/css/ionicons.scss">
                    <link rel="stylesheet" type="text/css" href="assets/css/font-awesome.scss">
                    <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">
                </head>
                <body onload="window.print();window.close()">
                    <div class="row">
                        ${content}
                    </div>
                </body>
            </html>
        `);
        popupWin.document.close();

    }

}
