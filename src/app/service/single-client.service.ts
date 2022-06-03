import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignleClientService {

  constructor(private http:HttpClient) { }
  BaseUrl:string=environment.pathApi

  getClient(i:number){
   return this.http.get(`${this.BaseUrl}/api/clienti/${i}`)
  }

  getFatture(id:number){
    return this.http.get(`${this.BaseUrl}/api/fatture/cliente/${id}?page=0&size=20&sort=id,ASC`)
  }

  getFatturePage(id:number,i:number){
    return this.http.get(`${this.BaseUrl}/api/fatture/cliente/${id}?page=${i}&size=20&sort=stato,ASC`)
  }

  getByDateBeetween(a:string,b:string){
    return this.http.get(`${this.BaseUrl}/api/fatture/data/?from=${a}&to=${b}&page=0&size=20&sort=id,ASC`)

  }

  getByDateBeetweenPages(a:string,b:string,i:number){
    return this.http.get(`${this.BaseUrl}/api/fatture/data/?from=${a}&to=${b}&page=${i}&size=20&sort=id,ASC`)

  }

  newFattura(data:any){
    return this.http.post(`${this.BaseUrl}/api/fatture`,data)
  }

  deleteFatt(id:number){
    return this.http.delete(`${this.BaseUrl}/api/fatture/${id}`)
  }

}
