import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientEditService {
  BaseUrl=environment.pathApi

  constructor(private http:HttpClient) { }

  getClient(i:number){
    return this.http.get(`${this.BaseUrl}/api/clienti/${i}`)
  }

  getComuni(i:number){
    return this.http.get(`${this.BaseUrl}/api/comuni?page=${i}&size=20&sort=id,ASC`)
  }

  getProvincie(i:number){
    return this.http.get(`${this.BaseUrl}/api/province?page=${i}&size=20&sort=id,ASC`)
  }

  updateClient(id:number,data:any){
    return this.http.put(`${this.BaseUrl}/api/clienti/${id}`,data)
  }
}
