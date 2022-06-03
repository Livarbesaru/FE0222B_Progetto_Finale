import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable , map} from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class FormModuleGuard implements CanActivate, CanActivateChild {
  constructor(private AuthSrv:AuthService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.AuthSrv.isLoggedIn$.pipe(map(isLoggedIn=>{
      if(isLoggedIn){
        return this.router.createUrlTree(['/'])
      }
      else{
        return true
      }
    }));
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let stateLogin=!!this.AuthSrv.isLoggedIn$
    return this.AuthSrv.isLoggedIn$.pipe(map(isLoggedIn=>{
      if(isLoggedIn){
        return this.router.createUrlTree(['/'])
      }
      else{
        return true
      }
    }));
  }

}
