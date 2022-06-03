import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, switchMap , take ,tap, finalize, catchError, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private AuthSrv:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let ok!:string
    return this.AuthSrv.account$.pipe(take(1),switchMap(user=>{
      console.log(user)
        const newReq=request.clone({
          headers:request.headers.set(
            'Authorization',`Bearer ${environment.adminToken}`
          )
          .set('X-TENANT-ID',environment.adminTenant)
        })
        return next.handle(newReq).pipe(tap(event=>{
          ok=event instanceof HttpResponse?'passata':'negata'
        }, error=>{}),catchError((error:HttpErrorResponse)=>{
          return throwError(error);
        }),finalize(()=>{

        }));
    }))
  }
}
