import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientiService {
  baseUrl:string=environment.pathApi
  constructor(private http:HttpClient) { }

  getClients(){
    return this.http.get(`${this.baseUrl}/api/clienti?page=0&size=20&sort=id,ASC`)
  }
  getClientsPage(page:number){
    return this.http.get(`${this.baseUrl}/api/clienti?page=${page}&size=20&sort=id,ASC`)
  }

  deleteClient(id:number){
    return this.http.delete(`${this.baseUrl}/api/clienti/${id}`)
  }

  deleteFattByClient(id:number){
    return this.http.delete(`${this.baseUrl}/api/fatture/cliente/${id}`)
  }
}
