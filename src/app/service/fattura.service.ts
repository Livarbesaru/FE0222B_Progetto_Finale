import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModificaFattura } from '../interface/modifica-fattura';

@Injectable({
  providedIn: 'root'
})
export class FatturaService {

  constructor(private http:HttpClient) { }
  baseUrl:string=environment.pathApi

  getFatt(id:number){
    return this.http.get(`${this.baseUrl}/api/fatture/${id}`)
  }

  updateFatt(id:number,data:ModificaFattura){
    return this.http.put(`${this.baseUrl}/api/fatture/${id}`,data)
  }
}
