import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';

// Redux
import { select } from '@angular-redux/store';
import { LOGS_DATA, LOGS_HEADER, LOGS_EXCEL_DATA, LOGS_EXCEL_HEADER } from '../../common/actions';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';
import { ExcelService } from '../../services/excel/excel.service';

// Interfaces
import { StatusData, LogOfStatus } from '../../interfaces/status.interface';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})

export class StatusComponent implements OnInit {

    @select() common;
    @select() statusStore;

    public dataConfig: any;
    public dateFrom;
    public dateTo;
    public pupils: any = [];
    public status: any = [];
    public reports: any = [];
    public showFilter: boolean = false;
    public header: any = [];
    public debuggerExportExcel: boolean = false;
    public env: string;
    public headerExcelFile: any[] = [];
    public excelData: any[] = [];
    public searchText: string = '';
    public showExportExcel: boolean = false;
    public allowShowListReport: boolean = false;
    public typeOptions: any;
    public typeSelected: any;
    public moneyPunishPerHour: number = 0;
    public totalMoneyPunish: number = 0;
    public maxWidthCenterCol: number;
    private dayOfWeek: string[] = [];
    private monthOfYear: string[] = [];
    private daysForReport: number;
    private millisecondsOfDay = 86400000;
    private checkedPupils: any = [];
    private reportData: any = {
        logsData: [],
        logsHeader: [],
        logsExcelData: [],
        logsExcelHeader: []
    }

    constructor(
        public firebaseService: FirebaseService,
        public helperService: HelperService,
        public translate: TranslateService,
        public excelService: ExcelService,
        public router: Router
    ) {

        if (!this.helperService.checkPermissionAccess('attendants_report') || !this.helperService.checkPermissionAccess('pre_after_school_report')) {
            this.router.navigate(['/']);
        }

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
            this.daysForReport = data['globalConfig']['report']['daysForReport'];
            this.debuggerExportExcel = data['globalConfig']['debugger']['exportExcel'];
            this.env = data['globalConfig']['environment'];
        });

        this.statusStore.subscribe(data => {
            this.reportData['logsData'] = data['logsData'];
            this.reportData['logsHeader'] = data['logsHeader'];
            this.reportData['logsExcelData'] = data['logsExcelData'];
            this.reportData['logsExcelHeader'] = data['logsExcelHeader'];
        });

        this.typeOptions = [
            { label: this.translate.instant('CLASS_ATTENDANCE'), value: 'CLASS_ATTENDANCE' },
            { label: this.translate.instant('BEFORE_AFTERSCHOOL'), value: 'BEFORE_AFTERSCHOOL' }
        ];

        // Set default type
        this.typeSelected = 'CLASS_ATTENDANCE';

    }

    async ngOnInit() {

        // Center column width = 70 % of table width, and table width = 10/12 of all screen
        this.maxWidthCenterCol = (window.innerWidth) * 7 / 12;

        this.reports = this.createOptionReportType()
        this.allowShowListReport = true
        this.initDate();
        this.dateFrom = new Date(new Date().setHours(0, 0, 0, 0) - (this.millisecondsOfDay * this.daysForReport));
        this.dateTo = new Date(new Date().setHours(0, 0, 0, 0));

        // Only get logs data after reload page
        if (this.reportData['logsData'].length > 0) {
            this.header = this.reportData['logsHeader'];
            this.status = this.reportData['logsData'];
            this.excelData = this.reportData['logsExcelData'];
            this.headerExcelFile = this.reportData['logsExcelHeader'];
        } else {
            this.helperService.showLoading();
            await this.getPupils();
            await this.getMoneyPunish();
            this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + (this.millisecondsOfDay - 1), this.checkedPupils);
        }

        this.togglePopup();

    }

    async getMoneyPunish() {

        try {

            const result = await this.firebaseService.get('money_punish');

            if (result.length > 0) {
                this.moneyPunishPerHour = parseInt(result[0]['money_punish'], 10);
            }

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function initialize date time
     */
    initDate() {
        this.dayOfWeek = [
            this.translate.instant('SUNDAY'),
            this.translate.instant('MONDAY'),
            this.translate.instant('TUESDAY'),
            this.translate.instant('WEDNESDAY'),
            this.translate.instant('THURSDAY'),
            this.translate.instant('FRIDAY'),
            this.translate.instant('SATURDAY')
        ];

        this.monthOfYear = [
            this.translate.instant('JANUARY'),
            this.translate.instant('FEBUARY'),
            this.translate.instant('MARCH'),
            this.translate.instant('APRIL'),
            this.translate.instant('MAY'),
            this.translate.instant('JUNE'),
            this.translate.instant('JULY'),
            this.translate.instant('AUGUST'),
            this.translate.instant('SEPTEMBER'),
            this.translate.instant('OCTOBER'),
            this.translate.instant('NOVEMBER'),
            this.translate.instant('DECEMBER')
        ];
    }

    /**
     * Function get list of pupils
     */
    async getPupils() {

        try {

            this.pupils = await this.firebaseService.get('pupils');
            // console.log(this.pupils);

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function handle checked pupils
     * @param  {} $event
     * @param  {} id
     */
    getCheckedPupils($event, id) {

        this.helperService.showLoading();

        const idOfPupil = id.toString();

        if ($event.target.checked) {
            this.checkedPupils.push(idOfPupil);
        } else {
            this.checkedPupils.forEach((value, index) => {
                if (value === idOfPupil) {
                    this.checkedPupils.splice(index, 1);
                }
            });
        }

        this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + (this.millisecondsOfDay - 1), this.checkedPupils);

    }

    /**
     * Function get days from start time & end time
     * @param  {number} startTime
     * @param  {number} endTime
     * @param  {number} stepTime
     */
    getHeader(startTime: number, endTime: number, stepTime: number) {

        const header = [];

        for (let i = startTime; i < endTime; i = i + stepTime) {
            header.push({
                day: this.getObjectOfDate(i, 'day'),
                date: new Date(i).getDate(),
                sup: this.getSuffixes(i),
                month: this.getObjectOfDate(i, 'month')
            })
        }

        return header;

    }

    /**
     * Function get object of date
     * @param  {number} time
     * @param  {string} type
     */
    getObjectOfDate(time: number, type: string) {

        switch (type) {
            case 'day': {
                return this.dayOfWeek[new Date(time).getDay()];
            }
            case 'month': {
                return this.monthOfYear[new Date(time).getMonth()];
            }
            default: {
                break;
            }
        }

    }

    /**
     * Function get suffixes of time
     * @param  {number} time
     */
    getSuffixes(time: number) {

        const date = new Date(time).getDate();
        let suf = '';

        switch (date) {
            case 1: {
                suf = this.translate.instant('SUFFIXES_ST');
                break;
            }
            case 2: {
                suf = this.translate.instant('SUFFIXES_ND');
                break;
            }
            case 3: {
                suf = this.translate.instant('SUFFIXES_RD');
                break;
            }
            default: {
                suf = this.translate.instant('SUFFIXES_TH');
            }
        }

        return suf;

    }

    /**
     * Function initialize report data
     * @param  {number} startTime
     * @param  {number} endTime
     */
    initReportData(startTime: number, endTime: number) {
        const item: StatusData = {
            first_name: '',
            last_name: '',
            sex: '',
            logs: [],
            half_total: 0,
            total_money_punish: 0
        }

        for (let i = startTime; i < endTime; i += this.millisecondsOfDay) {
            item.logs.push({
                agent_name_checkin_am: '',
                agent_name_checkout_am: '',
                agent_name_checkin_pm: '',
                agent_name_checkout_pm: '',
                time_checkin_am: 0,
                time_checkin_pm: 0,
                time_checkout_am: 0,
                time_checkout_pm: 0,
                learning_time_unit: 0,
                missed_half_day: 0,
            });
        }
        return item;
    }

    /**
     * Function get data of logs
     * @param  {number} start
     * @param  {number} end
     * @param  {string[]} arrId
     */
    async getLogs(start: number, end: number, arrId: string[], param?) {

        try {

            this.header = [];
            this.status = [];
            this.excelData = [];
            this.header = this.getHeader(start, end, this.millisecondsOfDay);
            const reportData = [];

            if (arrId && arrId.length > 0) {

                if (this.pupils.length > 0) {

                    const arrPupilsSelected = [];

                    for (let i = 0; i < this.pupils.length; i++) {

                        const item = this.initReportData(start, end);

                        item.first_name = this.pupils[i]['first_name'];
                        item.last_name = this.pupils[i]['last_name'];
                        item.sex = this.pupils[i]['sex'];

                        if (arrId.indexOf(this.pupils[i]['id']) > -1) {

                            arrPupilsSelected.push(this.pupils[i]['id']);

                            const itemConverted = await this.getLogsOfPupil(this.pupils[i]['id'], start, end, item, this.typeSelected);
                            reportData.push(itemConverted);

                        }

                        if (arrPupilsSelected.length === arrId.length) {
                            break;
                        }

                    }

                }

            } else {

                if (this.pupils.length > 0) {

                    this.totalMoneyPunish = 0;

                    for (let i = 0; i < this.pupils.length; i++) {

                        const item = this.initReportData(start, end);
                        item.first_name = this.pupils[i]['first_name'];
                        item.last_name = this.pupils[i]['last_name'];
                        item.sex = this.pupils[i]['sex'];

                        const itemConverted = await this.getLogsOfPupil(this.pupils[i]['id'], start, end, item, this.typeSelected);
                        reportData.push(itemConverted);

                    }

                }

            }

            this.status = reportData;
            this.helperService.dispatchToRedux(LOGS_DATA, this.status);
            this.helperService.dispatchToRedux(LOGS_HEADER, this.header);

        } catch (e) {
            console.log(e);
        } finally {
            this.helperService.hideLoading();
            this.convertLogsForExport(start, end);
        }

    }

    /**
     * Function get logs of pupil
     * @param  {string} pupilId
     * @param  {number} startTime
     * @param  {number} endTime
     * @param  {any} item
     * @param  {string} type
     */
    async getLogsOfPupil(pupilId: string, startTime: number, endTime: number, item: any, type: string) {

        try {

            // Get logs by id
            const logOfPupil = await this.firebaseService.getLogsWhere('logs', 'id', pupilId, type);

            if (logOfPupil.length > 0) {

                const logItem: LogOfStatus = {
                    agent_name_checkin_am: '',
                    agent_name_checkout_am: '',
                    agent_name_checkin_pm: '',
                    agent_name_checkout_pm: '',
                    time_checkin_am: 0,
                    time_checkin_pm: 0,
                    time_checkout_am: 0,
                    time_checkout_pm: 0,
                    learning_time_unit: 0,
                    missed_half_day: 0,
                };

                let total_time_unit = 0;
                let total_missed_half_day = 0;

                logOfPupil.forEach(log => {
                    logItem.agent_name_checkin_am = log.time_checkin_am ? this.getFirstChar(log.agent_name_checkin_am) : '';
                    logItem.agent_name_checkout_am = log.time_checkout_am ? this.getFirstChar(log.agent_name_checkout_am) : '';
                    logItem.agent_name_checkin_pm = log.time_checkin_pm ? this.getFirstChar(log.agent_name_checkin_pm) : '';
                    logItem.agent_name_checkout_pm = log.time_checkout_pm ? this.getFirstChar(log.agent_name_checkout_pm) : '';
                    logItem.time_checkin_am = log.time_checkin_am;
                    logItem.time_checkin_pm = log.time_checkin_pm;
                    logItem.time_checkout_am = log.time_checkout_am;
                    logItem.time_checkout_pm = log.time_checkout_pm;

                    if (logItem.time_checkin_am && logItem.time_checkout_am && (logItem.time_checkin_am < logItem.time_checkout_am)) {
                        logItem.learning_time_unit = this.getLearningTime(logItem.time_checkin_am, logItem.time_checkout_am);
                    }

                    if (logItem.time_checkin_pm && logItem.time_checkout_pm && (logItem.time_checkin_pm < logItem.time_checkout_pm)) {
                        logItem.learning_time_unit += this.getLearningTime(logItem.time_checkin_pm, logItem.time_checkout_pm);
                    }

                    for (let el = startTime, i = 0; el < endTime; el = el + this.millisecondsOfDay, i++) {

                        const tomorrow = (el + this.millisecondsOfDay);

                        if ((logItem.time_checkin_am > el && logItem.time_checkin_am < tomorrow) || (logItem.time_checkin_pm > el && logItem.time_checkin_pm < tomorrow)) {

                            // was check-in at am or pm
                            if (logItem.time_checkout_am === 0 && logItem.time_checkout_pm === 0) {
                                // was check-in but not yet check-out both am/pm
                                logItem.learning_time_unit = 0
                            }

                            // show time check-I/O report
                            item.logs[i] = logItem;

                            switch (type) {
                                case 'CLASS_ATTENDANCE': {
                                    if (
                                        (logItem.time_checkin_am === 0 && logItem.time_checkout_am === 0 || logItem.time_checkin_pm === 0 && logItem.time_checkout_pm) &&
                                        (logItem.time_checkin_am < tomorrow || logItem.time_checkin_pm < tomorrow)
                                    ) {
                                        logItem.missed_half_day += 1
                                        total_missed_half_day += logItem.missed_half_day
                                    }
                                    break;
                                }
                                case 'BEFORE_AFTERSCHOOL': {
                                    if (
                                        ((logItem.time_checkin_am && logItem.time_checkout_am) || (logItem.time_checkin_pm && logItem.time_checkout_pm)) &&
                                        (logItem.time_checkin_am < logItem.time_checkout_am || logItem.time_checkin_pm < logItem.time_checkout_pm)
                                    ) {
                                        total_time_unit += logItem.learning_time_unit;
                                    }
                                    break;
                                }
                            }

                            break;

                        }

                    }

                });

                item.half_total = total_time_unit;
                item.total_money_punish = total_missed_half_day * 2.5 * this.moneyPunishPerHour; // Because 1 missed_half_day = 2.5 hour
                this.totalMoneyPunish += item.total_money_punish;

            }

        } catch (e) {
            console.log(e);
        } finally {
            return item;
        }

    }

    /**
     * Function convert logs data for export excel file
     * Important: With package "xlsx": "^0.14.0"
     * in node_modules/xlsx/xlsx.js
     * comment line 18979 - 18983
     * function fuzzydate
     * @param  {number} startTime
     * @param  {number} endTime
     */
    convertLogsForExport(startTime: number, endTime: number) {

        // Create header for excel file
        const headerExcelFile = [
            {
                merge: false,
                cells: 0,
                value: this.translate.instant('FULLNAME'),
            },
            {
                merge: false,
                cells: 0,
                value: this.translate.instant('LOCATION'),
            }
        ];

        for (let i = startTime; i < endTime; i = i + this.millisecondsOfDay) {

            const dayOfMonth = new Date(i).getDate();
            const dayOfWeek = this.dayOfWeek[new Date(i).getDay()];
            const monthOfYear = this.monthOfYear[new Date(i).getMonth()];

            headerExcelFile.push({
                merge: true,
                cells: 4,
                value: `${dayOfWeek}, ${dayOfMonth}/${monthOfYear}` // Ex: Mon, 29/October
            });

        }

        headerExcelFile.push({
            merge: false,
            cells: 0,
            value: `${this.translate.instant('HALF_HOUR')} ${this.translate.instant('UNITS')}`,
        });
        this.headerExcelFile = headerExcelFile;

        // Create content
        if (this.status.length > 0) {

            for (let i = 0; i < this.status.length; i++) {

                const logs = this.status[i]['logs'];
                const arrContent = [];

                // Create half hour row
                const halfHourRow = {
                    excelData: []
                };

                // Create full name
                arrContent.push({
                    value: `${this.status[i]['first_name']} ${this.status[i]['last_name']}`
                });
                halfHourRow.excelData.push({
                    value: ''
                });

                // Create sex
                arrContent.push({
                    value: this.status[i]['sex'] ? this.status[i]['sex'] : ''
                });
                halfHourRow.excelData.push({
                    value: ''
                });

                let total = 0;

                if (logs.length > 0) {
                    for (let j = 0; j < logs.length; j++) {
                        arrContent.push({
                            value: logs[j]['time_checkin_am'] ? this.convertToTime(logs[j]['time_checkin_am']) : ''
                        });
                        arrContent.push({
                            value: logs[j]['time_checkout_am'] ? this.convertToTime(logs[j]['time_checkout_am']) : ''
                        });
                        arrContent.push({
                            value: logs[j]['time_checkin_pm'] ? this.convertToTime(logs[j]['time_checkin_pm']) : ''
                        });
                        arrContent.push({
                            value: logs[j]['time_checkout_pm'] ? this.convertToTime(logs[j]['time_checkout_pm']) : ''
                        });

                        halfHourRow.excelData.push({
                            value: logs[j]['learning_time_unit'] ? logs[j]['learning_time_unit'] : ''
                        });
                        halfHourRow.excelData.push({
                            value: ''
                        });
                        halfHourRow.excelData.push({
                            value: ''
                        });
                        halfHourRow.excelData.push({
                            value: ''
                        });

                        total += logs[j]['learning_time_unit'];
                    }
                }

                // Create total field
                arrContent.push({
                    value: ''
                });
                halfHourRow.excelData.push({
                    value: total
                });

                this.status[i]['excelData'] = arrContent;
                this.excelData.push(this.status[i]);
                this.excelData.push(halfHourRow);

            }

        }

        this.helperService.dispatchToRedux(LOGS_EXCEL_HEADER, this.headerExcelFile);
        this.helperService.dispatchToRedux(LOGS_EXCEL_DATA, this.excelData);

    }

    /**
     * Function convert to date time format
     * @param  {number} milisecond
     */
    convertToTime(milisecond: number) {

        if (milisecond) {

            const hours = new Date(milisecond).getHours();
            const minutes = new Date(milisecond).getMinutes();
            const h = (hours < 10) ? `0${hours}` : hours;
            const m = (minutes < 10) ? `0${minutes}` : minutes;
            return `${h}:${m}`;

        }

        return '';

    }

    /**
     * Function get logs report from type
     * @param data
     * @param type
     */
    getLogsReportFromType(data: any, type: string) {
        const logs = data.filter(log => {
            return log.type === type
        })
        return logs ? logs : [];
    }

    /**
     * Function get first character of string
     * @param  {string} str
     */
    getFirstChar(str: string) {
        const arr = [];
        str.split(' ').forEach(el => {
            arr.push(el.substring(0, 1));
        });
        return arr.join('');
    }

    /**
     * Function get learnig time unit
     * @param  {number} checkInTime
     * @param  {number} checkOutTime
     */
    getLearningTime(checkInTime: number, checkOutTime: number) {
        const minutes = Math.ceil((checkOutTime - checkInTime) / 1000 / 60);
        return Math.ceil(minutes / 30) * 0.5;
    }

    /**
     * Function handle onchange type
     */
    onChangeType() {
        // Clear search input
        this.clearText();

        this.helperService.showLoading();
        this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + (this.millisecondsOfDay - 1), this.checkedPupils);
    }

    /**
     * Function handle onchange calendar
     */
    handleOnChangeDate() {

        // Clear search input
        this.clearText();
        this.helperService.showLoading();

        // this.dateTo.getTime() + (this.millisecondsOfDay - 1) => currentday 23:59:59
        this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + (this.millisecondsOfDay - 1), this.checkedPupils);
    }

    /**
     * Function filter pupils
     */
    filterPupil() {
        this.showFilter = !this.showFilter;
        this.pupils.sort(function (a, b) {
            if (a.last_name < b.last_name) {
                return -1;
            }
            if (a.last_name > b.last_name) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Function hide search form when user click outside
     */
    togglePopup() {
        $(document).on('click', '.showPupil, .arrow, .btn-export, .search-pupils', (e) => {
            e.stopPropagation();
        });
        $(document).on('click', 'html, body', (e) => {
            $('.form-search-pupils, .btn-export').removeClass('active');
            this.showFilter = false;
            this.showExportExcel = false;
        });
    }

    /**
     * Function show button download reports as excel
     */
    showExportOptions() {
        this.showExportExcel = !this.showExportExcel;
    }

    /**
     * Function clear input text for search pupil
     */
    clearText() {
        this.searchText = '';
    }

    /**
     * Function export to excel
     */
    exportExcel() {
        this.excelService.exportTable(document.getElementById('export-excel'));
    }

    /**
    |--------------------------------------------------
    | Function export as excel file (Only use for package "xlsx": "^0.10.8")
    |--------------------------------------------------
    */
    /**
     * Function convert number to character
     * 1: A, 2: B, 27: AA, 28: AB
     */
    // toLetters(num) {
    //     const mod = num % 26;
    //     let pow = num / 26 | 0;
    //     const out = mod ? String.fromCharCode(64 + mod) : (pow-- , 'Z');
    //     return pow ? this.toLetters(pow) + out : out;
    // }

    /**
     * Function export to excel
     */
    // exportExcel() {

    //     const ws = {}, ws_left = {}, ws_center = {}, ws_right = {};
    //     let startCol = 1;

    //     // Header of left
    //     ws_left[this.toLetters(startCol) + 1] = { t: 's', v: 'Full Name' };
    //     ws_left[this.toLetters(startCol + 1) + 1] = { t: 's', v: 'Location' };
    //     startCol = 3;

    //     // Day header of logs
    //     const step = 4;
    //     ws['!merges'] = [];
    //     this.header.forEach((el, i) => {
    //         ws_center[this.toLetters(startCol) + 1] = {
    //             t: 's',
    //             v: el.day.substring(0, 3) + ', ' + el.date + '/' + el.month
    //         }
    //         startCol += step;
    //         ws['!merges'].push({
    //             s: { r: 0, c: (2 + step * i) }, e: { r: 0, c: (2 + step * (i + 1) - 1) }
    //         });
    //     });

    //     // Right header
    //     ws_right[this.toLetters(startCol) + 1] = { t: 's', v: 'Half-hour Units' };

    //     // Content
    //     this.status.forEach((val, i) => {
    //         ws['!merges'].push({ s: { r: 2 + i * 2, c: 0 }, e: { r: 2 + i * 2, c: 1 } }); // merge left col
    //         startCol = 1;
    //         ws_left[this.toLetters(startCol) + (2 + i * 2)] = {
    //             t: 's',
    //             v: val.last_name + ' ' + val.first_name
    //         }
    //         ws_left[this.toLetters(startCol + 1) + (2 + i * 2)] = {
    //             t: 's',
    //             v: val.sex
    //         }

    //         let subStart;
    //         val.logs.forEach((item, index) => {
    //             subStart = 3 + index * 4;
    //             // merge center col
    //             ws['!merges'].push({ s: { r: 2 + i * 2, c: 2 + index * 4 }, e: { r: 2 + i * 2, c: 2 + (index + 1) * 4 - 1 } });
    //             if (item.learning_time_unit === 0 || item.learning_time_unit === null) {
    //                 item.learning_time_unit = '';
    //             }
    //             ws_center[this.toLetters(subStart) + (2 + i * 2 + 1)] = {
    //                 t: 's',
    //                 v: item.learning_time_unit
    //             }
    //             ws_center[this.toLetters(subStart) + (2 + i * 2)] = {
    //                 t: 's',
    //                 v: this.convertToTime(item.time_checkin)
    //             }
    //             ws_center[this.toLetters(subStart + 1) + (2 + i * 2)] = {
    //                 t: 's',
    //                 v: item.agent_checkin
    //             }
    //             ws_center[this.toLetters(subStart + 2) + (2 + i * 2)] = {
    //                 t: 's',
    //                 v: this.convertToTime(item.time_checkout)
    //             }
    //             ws_center[this.toLetters(subStart + 3) + (2 + i * 2)] = {
    //                 t: 's',
    //                 v: item.agent_checkout
    //             }
    //         });
    //         // right content
    //         ws_right[this.toLetters(subStart + 4) + (i * 2 + 2 + 1)] = {
    //             t: 's',
    //             v: val.half_total
    //         }
    //     });

    //     ws['!ref'] = 'A1:ZZ' + (this.status.length * 2 + 1);  // set table reference
    //     Object.assign(ws, ws_left, ws_center, ws_right);

    //     const excelBuffer: any = XLSX.write(
    //         {
    //             SheetNames: ['data'],
    //             Sheets: { 'data': ws }
    //         }, {
    //             bookType: 'xlsx',
    //             type: 'buffer'
    //         }
    //     );

    //     const blob: Blob = new Blob([excelBuffer], {
    //         type: 'application/vnd.ms-excel;charset=charset=utf-8'
    //     });
    //     FileSaver.saveAs(blob, `export_${new Date().getTime()}.xlsx`);

    // }

    async createReportForTest() {

        try {

            const data_1 = {
                agent_key: '-LHIlsqG5piusUCu_JIw',
                agent_name: `Jay M'Bei`,
                id: '',
                sex: '1',
                status: 1,
                time_checkin: 1541238000000, // Sat Nov 03 2018 16:40:00
                time_checkout: 1541242800000 // Sat Nov 03 2018 18:00:00
            }

            const data_2 = {
                agent_key: '-LHIlsqG5piusUCu_JIw',
                agent_name: `Jay M'Bei`,
                id: '',
                sex: '1',
                status: 1,
                time_checkin: 1541151600000, // Fri Nov 02 2018 16:40:00
                time_checkout: 1541156400000 // Fri Nov 02 2018 18:00:00
            }

            const pupils = await this.firebaseService.get('pupils');

            if (pupils.length > 0) {

                for (let i = 0; i < pupils.length; i++) {
                    data_1.id = pupils[i]['id'];
                    await this.firebaseService.insert('logs', data_1);
                }

                for (let i = 0; i < pupils.length; i++) {
                    data_2.id = pupils[i]['id'];
                    await this.firebaseService.insert('logs', data_2);
                }

            }

            console.log('Success');

        } catch (e) {
            console.log(e);
        }

    }

    createOptionReportType() {
        return [
            { label: this.translate.instant('CLASS_ATTENDANCE'), value: '0' },
            { label: this.translate.instant('BEFORE_AFTERSCHOOL'), value: '1' }
        ]

    }

}
