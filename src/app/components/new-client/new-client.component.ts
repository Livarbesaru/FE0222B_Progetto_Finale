import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription , tap } from 'rxjs';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { Comune } from 'src/app/interface/comune';
import { Provincia } from 'src/app/interface/provincia';
import { NewClientService } from 'src/app/service/new-client.service';


@Component({
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClienteComponent implements OnInit {
  constructor(private router:ActivatedRoute, private routeTo:Router, private NewclientSrv:NewClientService,private FormBuilder: FormBuilder) { }
  sub!:Subscription
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
            Validators.required,Validators.pattern('[0-9.]*')
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
            Validators.required,Validators.pattern('[0-9]*')
          ]),
          localitaLegale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          viaLegale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          civicoLegale: this.FormBuilder.control(null, [
            Validators.required,Validators.pattern('[0-9]*')
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
            Validators.required,Validators.pattern('[0-9]*')
          ]),
          localitaOperativa: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          viaOperativa: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          civicoOperativa: this.FormBuilder.control(null, [
            Validators.required,Validators.pattern('[0-9]*')
          ])
        }),
        DatiAziendali: this.FormBuilder.group({
          ragioneSociale: this.FormBuilder.control(null, [
            Validators.required,
          ]),
          partitaIva: this.FormBuilder.control(null, [
            Validators.required,Validators.pattern('[0-9]*')
          ]),
          Pec: this.FormBuilder.control(null, [
            Validators.required,Validators.email
          ]),
          emailAziendale: this.FormBuilder.control(null, [
            Validators.required,Validators.email
          ]),
          TelefonoAziendale: this.FormBuilder.control(null, [
            Validators.required,Validators.pattern('[0-9]*')
          ]),
          tipoCliente: this.FormBuilder.control(null, [
            Validators.required
          ]),
             fatturatoAnnuo: this.FormBuilder.control(null, [
            Validators.required,Validators.pattern('[0-9]*')
          ])
        })
      }),
    });

    this.getComuni()
    console.log(this.form)
  }

  controlloType(tipo: string) {
    return this.form.get(tipo);
  }
  errorType(tipo: string, error: string) {
    return this.form.get(tipo)?.errors![error];
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  getComuni(){
    this.sub = this.NewclientSrv.getComuni(0).pipe(tap((client)=>{
      this.user=client
      this.comuni=this.user.content
      if(this.user.totalPages>1){
        for(let i =this.user.totalPages;i>0;i--){
          this.NewclientSrv.getComuni(0).pipe(tap((client)=>{
            this.user=client
            this.comuni=this.comuni.concat(this.user.content)
          })).subscribe()
        }
      }
      console.log(this.comuni)
      this.getProvincie()
    })).subscribe()
  }

  getProvincie(){
    this.sub = this.NewclientSrv.getProvincie(0).pipe(tap((client)=>{
      this.user=client
      this.province=this.user.content
      if(this.user.totalPages>1){
        for(let i =this.user.totalPages;i>0;i--){
          this.NewclientSrv.getProvincie(0).pipe(tap((client)=>{
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
      dataInserimento:dataOggi
    }
    console.log(dataForm)
    this.sub = this.NewclientSrv.newClient(dataForm).subscribe()
    this.refreshPage()
  }

  refreshPage(){
    setTimeout(()=>{
      window.location.reload();
    },2000)
  }
}
