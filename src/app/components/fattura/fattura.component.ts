import { Component, OnInit , OnDestroy} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { Fattura } from 'src/app/interface/fattura';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FatturaService } from 'src/app/service/fattura.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Client } from 'src/app/interface/client';
import { SignleClientService } from 'src/app/service/single-client.service';

@Component({
  templateUrl: './fattura.component.html',
  styleUrls: ['./fattura.component.scss']
})
export class FatturaComponent implements OnInit {
  sub!:Subscription
  id!:number
  fattura!:Fattura
  client!:Client
  userId!:number
  obj!:any
  form!: FormGroup;

    constructor(
      private SinglFatt:FatturaService,
       private router:ActivatedRoute,
       private routeTo:Router,
       private FormBuilder: FormBuilder,
       private SingleClSrv:SignleClientService) { }

  ngOnInit(): void {
    this.form =
    this.FormBuilder.group({
      fattura: this.FormBuilder.group({
        stato: this.FormBuilder.control(null, [
          Validators.required
        ])
      }),
    });

    this.sub = this.router.params.subscribe((params: Params) =>{
      this.id = +params['id'];
      this.userId= +params['userId'];
    });

    this.sub = this.SingleClSrv.getClient(this.userId).pipe(tap((client)=>{
      this.obj=client
      this.client=this.obj
      console.log(this.obj)
    })).subscribe()

    this.sub = this.SinglFatt.getFatt(this.id).pipe(tap((fatt)=>{
      this.obj=fatt
      this.fattura=this.obj
      console.log(this.fattura)
    })).subscribe()
  }

  controlloType(tipo: string) {
    return this.form.get(tipo);
  }
  errorType(tipo: string, error: string) {
    return this.form.get(tipo)?.errors![error];
  }

  goToPages(){
    this.routeTo.navigate(['/'])
    this.routeTo.navigate(['/cliente',this.userId])
  }

  submitRegi(form:any){
     if((<string>form.value.fattura.stato).trim()===''||form.value.fattura.stato==null){

    }
    else{
      console.log(form.value.fattura.stato)
      let dataForm={
        id: this.fattura.id,
        data: this.fattura.data,
        numero: this.fattura.numero,
        anno: this.fattura.anno,
        importo: this.fattura.importo,
        stato: {
            id: this.fattura.stato.id,
            nome: form.value.fattura.stato
        },
        cliente: {
            id: this.fattura.cliente.id
        }
      }
      if(form.value.fattura.stato==='PAGATA'){
        dataForm.stato.id=1
      }
      else if(form.value.fattura.stato==='NON PAGATA'){
        dataForm.stato.id=2
      }
      console.log(dataForm)
      this.sub= this.SinglFatt.updateFatt(this.id,dataForm).subscribe()
      this.refreshPage()
    }
  }

  refreshPage(){
    setTimeout(()=>{
      this.sub = this.SinglFatt.getFatt(this.id).pipe(tap((fatt)=>{
        this.obj=fatt
        this.fattura=this.obj
        console.log(this.fattura)
      })).subscribe()
    },1000)
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }
}
