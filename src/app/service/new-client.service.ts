import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewClientService {
  BaseUrl=environment.pathApi

  constructor(private http:HttpClient) { }

  getComuni(i:number){
    return this.http.get(`${this.BaseUrl}/api/comuni?page=${i}&size=20&sort=id,ASC`)
  }

  getProvincie(i:number){
    return this.http.get(`${this.BaseUrl}/api/province?page=${i}&size=20&sort=id,ASC`)
  }

  newClient(data:any){
    return this.http.post(`${this.BaseUrl}/api/clienti`,data)
  }
}
