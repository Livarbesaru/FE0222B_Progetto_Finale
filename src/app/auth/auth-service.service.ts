import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,tap ,map} from 'rxjs';
import { DataAuth } from '../interface/data-auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHElperService=new JwtHelperService()
  private accountVerification=new BehaviorSubject<null|DataAuth>(null)
  account$=this.accountVerification.asObservable()
  isLoggedIn$=this.account$.pipe(map((user)=>!!user))

  autoLogOut:any

  BaseUrl:string=environment.pathApi

  constructor(private http:HttpClient,private router:Router) { }

  submitRegistration(data:any) {
    return this.http.post(`${this.BaseUrl}/api/auth/signup`, data)
  }

  submitLogin(form:any) {
    return this.http.post<DataAuth>(`${this.BaseUrl}/api/auth/login`, {username:form.username,password:form.password}).pipe(tap((data)=>{
      this.accountVerification.next(data)
      localStorage.setItem("user",JSON.stringify(data))
      this.router.navigate(['/'])

      const expirationDate=this.jwtHElperService.getTokenExpirationDate(data.accessToken) as Date
      this.autoLogout(expirationDate)
    }))
  }

  autoLogin(){
    if(localStorage.getItem('user')){
      let dataUser=JSON.parse(localStorage.getItem('user')!)
      if(this.jwtHElperService.isTokenExpired(dataUser.accessToken)){
        this.router.navigate(['/login'])
        return
      }
      else{
        this.accountVerification.next(dataUser)
        const expirationDate=this.jwtHElperService.getTokenExpirationDate(dataUser.accessToken) as Date
        this.autoLogout(expirationDate)
      }
    }
  }

  logout(){
    this.accountVerification.next(null)
    this.router.navigate(['/login'])
    localStorage.removeItem('user')
    if(this.autoLogOut){
      clearTimeout(this.autoLogOut)
    }
  }

  autoLogout(expirationDate:Date){
    const expMillSc=expirationDate.getTime()-new Date().getTime()
  this.autoLogOut= setTimeout(() => {
      this.logout()
    }, expMillSc);
  }
}
