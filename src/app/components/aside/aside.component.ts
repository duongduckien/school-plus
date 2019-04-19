import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Serivices
import { HelperService } from '../../services/helper/helper.service';
import { ConfigService } from '../../services/config/config.service';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {

    public menuMobile: boolean = true;
    public permission: string[] = [];
    public isAdmin: boolean = false;
    public showErrorLogs: boolean = false;

    constructor(
        public translate: TranslateService,
        public helperService: HelperService,
        public configService: ConfigService
    ) { }

    ngOnInit() {
        this.permission = this.helperService.getPermission();
        this.isAdmin = this.helperService.isAdmin();
        this.showErrorLogs = (this.configService.dataConfig['environment'] === 'development' && this.configService.dataConfig['debugger']['showErrorLogs']) ? true : false;
    }

    /**
     * Function open menu on mobile
     */
    openMenu() {
        this.menuMobile = !this.menuMobile;
    }
}
