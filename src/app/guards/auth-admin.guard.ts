import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Services
import { HelperService } from '../services/helper/helper.service';
import { FirebaseService } from '../services/firebase/firebase.service';

@Injectable()
export class AuthAdminGuard implements CanActivate {

    constructor(
        public router: Router,
        public helperService: HelperService,
        public firebaseService: FirebaseService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (!this.helperService.getItemFromLocalStorage('smartschool')) {
            this.router.navigate(['/login']);
            return false;
        }

        return true;

    }

}

