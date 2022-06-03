import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtentiService {

  constructor(private http:HttpClient) { }

  BaseUrl:string=environment.pathApi

  getUsers(){
   return this.http.get(`${this.BaseUrl}/api/users`)
  }

  getUsersPages(page:number){
    return this.http.get(`${this.BaseUrl}/api/users?page=${page}`)
  }
}
