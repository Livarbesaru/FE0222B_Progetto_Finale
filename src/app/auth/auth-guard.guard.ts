import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private AuthSrv:AuthService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.AuthSrv.isLoggedIn$.pipe(map(isLoggedIn=>{
      if(isLoggedIn){
        return true
      }
      else{
        return this.router.createUrlTree(['/login'])
      }
    }));
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.AuthSrv.isLoggedIn$.pipe(map(isLoggedIn=>{
        if(isLoggedIn){
          return true
        }
        else{
          return this.router.createUrlTree(['/login'])
        }
      }));
  }

}
