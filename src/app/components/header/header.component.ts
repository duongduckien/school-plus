import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// Services
import { HelperService } from '../../services/helper/helper.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(
        public translate: TranslateService,
        public helperService: HelperService,
        private router: Router
    ) { }

    ngOnInit() {
        this.translate.use('en');
    }

    /**
     * Function change language
     */
    changeLanguage(type: string) {
        this.translate.use(type);
    }

    /**
     * Function log out
     */
    logout() {
        this.helperService.removeItemInLocalStorage('smartschool');
        this.router.navigate(['/login']);
    }

}
