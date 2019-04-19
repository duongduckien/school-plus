import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

// Services
import { ConfigService } from '../config/config.service';

@Injectable()
export class ExcelService {

    constructor(
        public configService: ConfigService
    ) { }

    public exportTable(dom) {

        const prefixName = this.configService.dataConfig['exportFile']['prefixName'];
        const extension = this.configService.dataConfig['exportFile']['extension'];
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(dom);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${prefixName}${new Date().getTime()}.${extension}`);

    }

}
