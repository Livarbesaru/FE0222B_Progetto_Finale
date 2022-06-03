import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription , tap } from 'rxjs';
import { Params } from '@angular/router';
import { Client } from 'src/app/interface/client';
import { ClientEditService } from 'src/app/service/client-edit.service';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { Comune } from 'src/app/interface/comune';
import { Provincia } from 'src/app/interface/provincia';

@Component({
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  constructor(private router:ActivatedRoute, private routeTo:Router, private clientEditSrv:ClientEditService,private FormBuilder: FormBuilder) { }
  client!:Client
  sub!:Subscription
  id!:number
  user!:any
  form!: FormGroup;
  comuni!:Comune[]
  province!:Provincia[]


  ngOnInit(): void {
    this.form =
    this.FormBuilder.group({
      utente: this.FormBuilder.group({
        DatiNominativi: this.FormBuilder.group({
          nomeContatto: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          cognomeContatto: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          emailContatto: this.FormBuilder.control(null, [
            Validators.required,Validators.email
          ]),
          TelefonoContatto: this.FormBuilder.control(null, [
            Validators.required,
          ])
        }),
        SedeLegale: this.FormBuilder.group({
          provinciaLegale: this.FormBuilder.control(null, [
            Validators.required
          ]),
          comuneLegale: this.FormBuilder.control(null, [
            Validators.required
          ]),
          capLegale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          localitaLegale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          viaLegale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          civicoLegale: this.FormBuilder.control(null, [
            Validators.required,
          ])
        }),
        SedeOperativa: this.FormBuilder.group({
          provinciaOperativa: this.FormBuilder.control(null, [
            Validators.required
          ]),
          comuneOperativa: this.FormBuilder.control(null, [
            Validators.required
          ]),
          capOperativa: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          localitaOperativa: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          viaOperativa: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          civicoOperativa: this.FormBuilder.control(null, [
            Validators.required,
          ])
        }),
        DatiAziendali: this.FormBuilder.group({
          ragioneSociale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          partitaIva: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          Pec: this.FormBuilder.control(null, [
            Validators.required,Validators.email
          ]),
          emailAziendale: this.FormBuilder.control(null, [
            Validators.required,Validators.email
          ]),
          TelefonoAziendale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          tipoCliente: this.FormBuilder.control(null, [
            Validators.required
          ]),
             fatturatoAnnuo: this.FormBuilder.control(null, [
            Validators.required,
          ])
        })
      }),
    });

    this.sub = this.router.params.subscribe((params: Params) =>{
      this.id = +params['id'];
    });

    this.sub = this.clientEditSrv.getClient(this.id).pipe(tap((client)=>{
      this.user=client
      this.client=this.user
      this.user={}
      console.log(this.client)
    })).subscribe()

    this.getComuni()
    console.log(this.form)
  }

  controlloType(tipo: string) {
    return this.form.get(tipo);
  }
  errorType(tipo: string, error: string) {
    return this.form.get(tipo)?.errors![error];
  }

  getComuni(){
    this.sub = this.clientEditSrv.getComuni(0).pipe(tap((client)=>{
      this.user=client
      this.comuni=this.user.content
      if(this.user.totalPages>1){
        for(let i =this.user.totalPages;i>0;i--){
          this.clientEditSrv.getComuni(0).pipe(tap((client)=>{
            this.user=client
            this.comuni=this.comuni.concat(this.user.content)
            console.log(this.comuni)
          })).subscribe()
        }
      }
      console.log(this.comuni)
      this.getProvincie()
    })).subscribe()
  }

  goToPages(){
    this.routeTo.navigate(['/'])
    this.routeTo.navigate(['/cliente',this.client.id])
  }

  getProvincie(){
    this.sub = this.clientEditSrv.getProvincie(0).pipe(tap((client)=>{
      this.user=client
      this.province=this.user.content
      if(this.user.totalPages>1){
        for(let i =this.user.totalPages;i>0;i--){
          this.clientEditSrv.getProvincie(0).pipe(tap((client)=>{
            this.user=client
            this.province=this.province.concat(this.user.content)
          })).subscribe()
        }
      }
      console.log(this.province)
    })).subscribe()
  }

  submitRegi(form:any){
    let dataOggi=new Date()
    let idComuneLegale!:number
    idComuneLegale=this.comuni[this.comuni.findIndex(x=>x.nome===form.utente.SedeLegale.comuneLegale)].id
    let idProvinciaLegale!:number
    idProvinciaLegale=this.province[this.province.findIndex(x=>x.nome===form.utente.SedeLegale.provinciaLegale)].id
    let idComuneOperativa!:number
    idComuneOperativa=this.comuni[this.comuni.findIndex(x=>x.nome===form.utente.SedeOperativa.comuneOperativa)].id
    let idProvinciaOperativa!:number
    idProvinciaOperativa=this.province[this.province.findIndex(x=>x.nome===form.utente.SedeOperativa.provinciaOperativa)].id
    let siglaProvinciaLegale!:string
    siglaProvinciaLegale=this.province[this.province.findIndex(x=>x.nome===form.utente.SedeLegale.provinciaLegale)].sigla
    let siglaProvinciaOperativa!:string
    siglaProvinciaOperativa=this.province[this.province.findIndex(x=>x.nome===form.utente.SedeOperativa.provinciaOperativa)].sigla

    let dataForm={
      id:this.client.id,
      cognomeContatto: form.utente.DatiNominativi.cognomeContatto,
      email: form.utente.DatiAziendali.emailAziendale,
      emailContatto: form.utente.DatiNominativi.emailContatto,
      fatturatoAnnuale: form.utente.DatiAziendali.fatturatoAnnuo,
      indirizzoSedeLegale: {
        via: form.utente.SedeLegale.viaLegale,
        civico: form.utente.SedeLegale.civicoLegale,
        cap: form.utente.SedeLegale.capLegale,
        localita: form.utente.SedeLegale.localitaLegale,
        comune:{
          id:idComuneLegale,
          nome:form.utente.SedeLegale.comuneLegale,
          provincia:{
            id:idProvinciaLegale,
            nome:form.utente.SedeLegale.provinciaLegale,
            sigla:siglaProvinciaLegale
          }
        }
      },
      indirizzoSedeOperativa: {
        via: form.utente.SedeOperativa.viaOperativa,
        civico: form.utente.SedeOperativa.civicoOperativa,
        cap: form.utente.SedeOperativa.capOperativa,
        localita: form.utente.SedeOperativa.localitaOperativa,
        comune:{
          id:idComuneOperativa,
          nome:form.utente.SedeOperativa.comuneOperativa,
          provincia:{
            id:idProvinciaOperativa,
            nome:form.utente.SedeOperativa.provinciaOperativa,
            sigla:siglaProvinciaOperativa
          }
        }
      },
      nomeContatto: form.utente.DatiNominativi.nomeContatto,
      partitaIva: form.utente.DatiAziendali.partitaIva,
      pec: form.utente.DatiAziendali.Pec,
      ragioneSociale: form.utente.DatiAziendali.ragioneSociale,
      telefono: form.utente.DatiAziendali.TelefonoAziendale,
      telefonoContatto: form.utente.DatiNominativi.TelefonoContatto,
      tipoCliente: form.utente.DatiAziendali.tipoCliente,
      dataUltimoContatto:dataOggi,
      dataInserimento:this.client.dataInserimento
    }
    console.log(dataForm)
    this.sub=this.clientEditSrv.updateClient(this.id,dataForm).subscribe()
     this.refreshPage()
  }

  refreshPage(){
    setTimeout(()=>{
      window.location.reload();
    },2000)
  }
}
