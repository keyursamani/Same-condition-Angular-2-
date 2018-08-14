
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
 import { HeadersProvider } from './../common/core/headers.providers';

@Injectable()
export class UnauthenticatedGuard extends HeadersProvider implements CanActivate {

    constructor(private router: Router) {
      super();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.getToken()!='' && this.getToken()!=null && this.getToken()!='null') {
             return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
