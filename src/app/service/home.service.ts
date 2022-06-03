import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http:HttpClient) { }
  BaseUrl:string=environment.pathApi

  getFatture(stato:number,){
    return this.http.get(`${this.BaseUrl}/api/fatture/stato/${stato}?page=0&size=20&sort=id,ASC`)
  }
  getClients(){
    return this.http.get(`${this.BaseUrl}/api/clienti?page=0&size=20&sort=id,ASC`)
  }
  getClientsBudget(a:number,b:number){
    return this.http.get(`${this.BaseUrl}/api/clienti/fatturatoannuale?from=${a}&to=${b}`)
  }
}
