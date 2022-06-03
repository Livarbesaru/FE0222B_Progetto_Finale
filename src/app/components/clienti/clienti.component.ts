import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Client } from 'src/app/interface/client';
import { ClientiService } from 'src/app/service/clienti.service';

@Component({
  templateUrl: './clienti.component.html',
  styleUrls: ['./clienti.component.scss']
})
export class ClientiComponent implements OnInit {

  constructor(private ClientSrv:ClientiService, private router:Router) { }
  clients!:Client[]
  pages:number[]=[]
  ClientsPages!:number
  sub!:Subscription
  momentObj!:any
  filtro:boolean=false
  filtredClient:Client[]=[]
  filtrocompleto=false


  ngOnInit(): void {
    this.filtrocompleto=false
    this.filtro=false
    this.getClients()
  }

  getClients(){
    this.sub=this.ClientSrv.getClients().pipe(tap((clients)=>{
      this.momentObj=clients
      this.ClientsPages=this.momentObj.totalPages
      this.pages=[...Array(this.momentObj.totalPages).keys()]
      console.log(this.clients)
      this.clients=this.momentObj.content
    })).subscribe()
  }

  goToPages(id:number){
    this.router.navigate(['/cliente',id])
  }

  goToPagesEdit(id:number){
    this.router.navigate(['/clienteEdit',id])
  }

  goToNewClient(){
    this.router.navigate(['/newcliente'])
  }


  getClientsPages(i:number){
    this.sub=this.ClientSrv.getClientsPage(i).pipe(tap((clients)=>{
      this.momentObj=clients
      this.clients=this.momentObj.content
    })).subscribe()
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  deleteClientAndFatt(id:number){
    this.sub = this.ClientSrv.deleteClient(id).subscribe()
    this.sub = this.ClientSrv.deleteFattByClient(id).subscribe()
    this.refreshPage()
  }

  refreshPage(){
    setTimeout(()=>{
      this.getClients()
    },1000)
  }

  getDataFilter(){
    let email=(<HTMLInputElement>document.getElementById('email')).value
    let nome=(<HTMLInputElement>document.getElementById('Nome')).value
    let cognome=(<HTMLInputElement>document.getElementById('Cognome')).value
    let arrayValori
    if((nome!=null && nome !='') && (cognome!=null && cognome !='') && (email!=null && email !='')){
      arrayValori=[{value:1,filtro:nome},{value:2,filtro:cognome},{value:3,filtro:email}]
    }
    else if((nome!=null && nome !='') && (cognome!=null && cognome !='') && (email==null || email =='')){
      arrayValori=[{value:1,filtro:nome},{value:2,filtro:cognome},{value:3,filtro:null}]
    }
    else if((nome==null || nome ==='') && (cognome!=null && cognome !='') && (email!=null && email !='')){
      arrayValori=[{value:1,filtro:null},{value:2,filtro:cognome},{value:3,filtro:email}]
    }
    else if((nome!=null && nome !='') && (cognome==null || cognome ==='') && (email!=null && email !='')){
      arrayValori=[{value:1,filtro:nome},{value:2,filtro:null},{value:3,filtro:email}]
    }
    else if((nome==null || nome ==='') && (cognome==null || cognome ==='') && (email!=null && email !='')){
      arrayValori=[{value:1,filtro:null},{value:2,filtro:null},{value:3,filtro:email}]
    }
    else if((nome==null || nome ==='') && (cognome!=null && cognome !='') && (email==null || email ==='')){
      arrayValori=[{value:1,filtro:null},{value:2,filtro:cognome},{value:3,filtro:null}]
    }
    else if((nome!=null && nome !='') && (cognome==null || cognome ==='') && (email==null || email ==='')){
      arrayValori=[{value:1,filtro:nome},{value:2,filtro:null},{value:3,filtro:null}]
    }
    if(arrayValori!=null){
      return arrayValori
    }
    else{
      return null
    }
  }

  filterClients(){
    console.log(this.getDataFilter()!=null)
    console.log(this.ClientsPages)
    if(this.getDataFilter()!=null){
      this.clients=[]
      for(let i=0;i<=this.ClientsPages;i++){
          this.sub=this.ClientSrv.getClientsPage(i).pipe(tap((clients)=>{
            this.momentObj=clients
            console.log(this.momentObj)
            this.clients=this.clients.concat(this.momentObj.content)
            console.log(this.clients)
            if(i===this.ClientsPages){
              setTimeout(()=>{
                this.Clientsfiltred()
              },1000)
            }
        })).subscribe()
      }
    }
  }

  Clientsfiltred(){
    console.log('filtro')
    console.log(this.getDataFilter())
    if(this.getDataFilter()!=null){
      let arraySortatoFiltro=this.getDataFilter()
      console.log(arraySortatoFiltro)
      let nome=arraySortatoFiltro![0].filtro
      let cognome=arraySortatoFiltro![1].filtro
      let email=arraySortatoFiltro![2].filtro
      if(cognome!=null && nome!=null && email!=null){
        this.filtredClient=this.clients.filter(x=>x.nomeContatto.trim().toUpperCase()===nome!.trim().toUpperCase())
        this.filtredClient=this.filtredClient.filter(x=>x.cognomeContatto.trim().toUpperCase()===cognome!.trim().toUpperCase())
        this.filtroEmail()
        this.filtro=true
        this.filtrocompleto=true
      }
      else if(cognome!=null && nome!=null && email==null){
        this.filtredClient=this.clients.filter(x=>x.nomeContatto.trim().toUpperCase()===nome!.trim().toUpperCase())
        this.filtroEmail()
        this.filtro=true
        this.filtrocompleto=true
      }
      else if(cognome!=null && nome==null && email!=null){
        this.filtredClient=this.clients.filter(x=>x.cognomeContatto.trim().toUpperCase()===cognome!.trim().toUpperCase())
        this.filtroEmail()
        this.filtro=true
        this.filtrocompleto=true
      }
      else if(cognome==null && nome!=null && email!=null){
        this.filtredClient=this.clients.filter(x=>x.nomeContatto.trim().toUpperCase()===nome!.trim().toUpperCase())
        this.filtroEmail()
        this.filtro=true
        this.filtrocompleto=true
      }
      else if(nome!=null){
        this.filtredClient=this.clients.filter(x=>x.nomeContatto.trim().toUpperCase()===nome!.trim().toUpperCase())
        if(cognome!=null){
          this.filtredClient=this.clients.filter(x=>x.cognomeContatto.trim().toUpperCase()===cognome!.trim().toUpperCase())
          if(email!=null){
            this.filtroEmail()
          }
        }
        else if(cognome==null && email!=null){
          this.filtroEmail()
        }
        this.filtro=true
        this.filtrocompleto=true
      }
      else if(cognome!=null){
        this.filtredClient=this.clients.filter(x=>x.cognomeContatto.trim().toUpperCase()===cognome!.trim().toUpperCase())

        if(email!=null){
          this.filtroEmail()
        }
        this.filtro=true
        this.filtrocompleto=true
      }
      else if(cognome==null && nome==null && email!=null){
        for(let i=this.clients.length-1;i>=0;i--){
          if(this.clients[i].emailContatto!=null){
            if(this.clients[i].emailContatto.trim().toUpperCase()===email!.trim().toUpperCase()){

            }
            else{
              this.clients.splice(i,1)
            }
          }
          else{
            this.clients.splice(i,1)
          }
          console.log(this.clients)
        }
        this.filtredClient=this.clients
        this.filtro=true
        this.filtrocompleto=true
      }
      console.log(this.filtredClient)
    }
  }
  filtroEmail(){
    let email=this.getDataFilter()![2].filtro
    for(let i=this.filtredClient.length-1;i>=0;i--){
      if(this.filtredClient[i].emailContatto!=null){
        if(this.filtredClient[i].emailContatto.trim().toUpperCase()===email!.trim().toUpperCase()){

        }
        else{
          this.filtredClient.splice(i,1)
        }
      }
      else{
        this.filtredClient.splice(i,1)
      }
      console.log(this.clients)
    }
    this.filtro=true
  }
}
