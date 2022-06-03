import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModificaFattura } from '../interface/modifica-fattura';

@Injectable({
  providedIn: 'root'
})
export class FattureService {

  constructor(private http:HttpClient) { }

  baseUrl:string=environment.pathApi

  getFatture(){
    return this.http.get(`${this.baseUrl}/api/fatture?page=0&size=20&sort=id,ASC`)
  }
  getFatturePage(page:number){
    return this.http.get(`${this.baseUrl}/api/fatture?page=${page}&size=20&sort=id,ASC`)
  }

  getByStat(page:number,stato:number){
    return this.http.get(`${this.baseUrl}/api/fatture/stato/${stato}?page=${page}&size=20&sort=id,ASC`)
  }
  getBydate(page:number,a:string,b:string){
    return this.http.get(`${this.baseUrl}/api/fatture/data/?from=${a}&to=${b}&page=${page}&size=20&sort=id,ASC`)
  }
  getByAmount(page:number,a:number,b:number){
    return this.http.get(`${this.baseUrl}/api/fatture/importo/?from=${a}&to=${b}&page=${page}&size=20&sort=id,ASC`)
  }

  updateFatt(id:number,data:ModificaFattura){
    return this.http.put(`${this.baseUrl}/api/fatture/${id}`,data)
  }

  deleteFatt(id:number){
    return this.http.delete(`${this.baseUrl}/api/fatture/${id}`)
  }
}
