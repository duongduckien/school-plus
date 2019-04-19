import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Services
import { HelperService } from '../services/helper/helper.service';

@Injectable()
export class AuthAccountGuard implements CanActivate {

    constructor(
        public router: Router,
        public helperService: HelperService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.helperService.getItemFromLocalStorage('smartschool')) {
            this.router.navigate(['/statistic']);
            return false;
        }

        return true;

    }
}
