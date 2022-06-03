import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Fattura } from 'src/app/interface/fattura';
import { FattureService } from 'src/app/service/fatture.service';

@Component({
  templateUrl: './fatture.component.html',
  styleUrls: ['./fatture.component.scss']
})
export class FattureComponent implements OnInit {

  constructor(private fattureSrv:FattureService,private routeTo:Router) { }
  Obj!:any
  fatture!:Fattura[]
  fattureAny!:any
  pages!:number
  sub!:Subscription
  pagina:number=0
  statoId:number=0
  stato:string='ok'
  controllo=false
  pageFilter=0
  alertBootstrap:boolean=false
  validCampDate:boolean=true
  validCampStat:boolean=true
  validCampAmount:boolean=true

  arrayDate:Fattura[]=[]
  dataStart!:string[]
  dataEnd!:string[]

  arrayStat:Fattura[]=[]

  arrayAmount:Fattura[]=[]
  moneyStart!:number
  moneyEnd!:number

  pagesDate:number=0
  pagesStat:number=0
  pagesAmount:number=0
  counInterval=0

  ngOnInit(): void {
    this.validCampDate=true
    this.validCampStat=true
    this.validCampAmount=true
    this.alertBootstrap=false
    this.controllo=false
    this.arrayAmount=[]
    this.arrayDate=[]
    this.arrayStat=[]
    this.getfatture()
  }

  refresh(){
    window.location.reload()
  }

  finePagina(){
    this.pagina=this.pages-1
    this.getfatturePages(this.pagina)
  }
  aumPagina(){
    this.pagina++
    if(this.pagina>this.pages-1){
      this.inizioPagina()
    }
    else{
      this.getfatturePages(this.pagina)
    }
  }
  dimPagina(){
    if(this.pagina===0){
      this.finePagina()
    }
    else{
      this.pagina--
      this.getfatturePages(this.pagina)
    }
  }
  inizioPagina(){
    this.pagina=0
    this.getfatturePages(this.pagina)
  }
  getfatture(){
    this.sub=this.fattureSrv.getFatture().pipe(tap((fatture)=>{
      this.Obj=fatture
      this.fatture=this.Obj.content
      this.pages=this.Obj.totalPages
      console.log(this.fatture)
    })).subscribe()
  }

  getfatturePages(i:number){
    this.sub=this.fattureSrv.getFatturePage(i).pipe(tap((fatture)=>{
      this.Obj=fatture
      this.fatture=this.Obj.content
    })).subscribe()
  }

  finePaginaFilter(){
    this.pageFilter=this.fattureAny.length-1
  }
  aumPaginaFilter(){
    this.pageFilter++
    if(this.pageFilter>this.fattureAny.length-1){
      this.inizioPaginaFilter()
    }
  }
  dimPaginaFilter(){
    if(this.pageFilter===0){
      this.finePaginaFilter()
    }
    else{
      this.pageFilter--
      if(this.pageFilter<0){
        this.finePaginaFilter()
      }
    }
  }
  inizioPaginaFilter(){
    this.pageFilter=0
  }

  goToPages(id:number,idUser:number){
    this.routeTo.navigate(['/'])
    this.routeTo.navigate(['/fattura',id,idUser])
  }

  deleteFatt(id:number){
   this.sub= this.fattureSrv.deleteFatt(id).subscribe()
   this.refreshPage()
  }

  refreshPage(){
    setTimeout(()=>{
      this.getfatture()
    },1000)
  }

  //sorting

  sortFatt(){
    let valStart=(<HTMLInputElement>document.getElementById('startDate')).value
    let valEnd=(<HTMLInputElement>document.getElementById('finishDate')).value
    let valStartMoney=(<HTMLInputElement>document.getElementById('startMoney')).value
    let valEndMoney=(<HTMLInputElement>document.getElementById('finishMoney')).value
    let stato=(<HTMLInputElement>document.getElementById('paymentStatus')).value
    if(
      ((valStart!=null && valEnd!=null) && (new Date(Date.parse(valStart)).getTime() < new Date(Date.parse(valEnd)).getTime())
     ||((valStartMoney!=null && valEndMoney!=null) && (parseInt(valStartMoney) < parseInt(valEndMoney)))
     ||(stato==="PAGATA"||stato==="NON PAGATA"))
      ){
        if(((valStart!=null && valEnd!=null) && ((new Date(Date.parse(valStart))).getTime() < (new Date(Date.parse(valEnd))).getTime()))){
          this.getFattByDateBeetween()
        }
        else{
          this.pagesDate=0
          this.alertBootstrap=true
          this.validCampDate=false
        }
        if(((valStartMoney!=null && valEndMoney!=null) && (parseInt(valStartMoney) < parseInt(valEndMoney)))){
          this.getFattByMoneyBeetween()
        }
        else{
          this.pagesAmount=0
          this.alertBootstrap=true
          this.validCampAmount=false
        }
        if((stato!=null||stato===!null)&&(stato==="PAGATA"||stato==="NON PAGATA")){
          this.getFattbyStat()
        }
        else{
          this.pagesStat=0
          this.alertBootstrap=true
          this.validCampStat=false
        }
        setTimeout(()=>{
          this.arraySorted()
        },2000)
    }
  }

  alertToFalse(){
    this.alertBootstrap=false
    this.validCampDate=true
    this.validCampStat=true
    this.validCampAmount=true
  }

  arraySorted(){
    let sortArr=[
      {amount:this.pagesAmount,name:'Amount'},
      {amount:this.pagesDate,name:'Date'},
      {amount:this.pagesStat,name:'Stat'}
    ]

    sortArr.sort( (a, b) => a.amount - b.amount);
    console.log(sortArr)

    this.calledSort(sortArr[2].name)
  }

  calledSort(a:string){
    this.controllo=true
    this.fatture=[]
    this.fattureAny=[]
    if(a==='Amount'){
      console.log("AMOUNT")
      if(this.pagesAmount===0){
          this.sub= this.fattureSrv.getByAmount(0,this.moneyStart,this.moneyEnd).pipe(tap((fatture)=>{
            this.Obj=fatture
            this.fatture=this.fatture.concat(this.Obj.content)
            console.log(this.fatture)
            if(this.dataStart!=null && this.dataEnd!=null){
              let date1=new Date(`${this.dataStart[0]}-${this.dataStart[1]}-${this.dataStart[2]}`)
              let date2=new Date(`${this.dataEnd[0]}-${this.dataEnd[1]}-${this.dataEnd[2]}`)
              console.log(date1, typeof date1)
              console.log(date2, typeof date2)
              for(let i=this.fatture.length-1;i>=0;i--){
                if(this.fatture[i].data!=null){
                  let dataFatt=new Date(Date.parse((this.fatture[i].data.toString())))
                  let risultatoData=date1.getTime() < dataFatt.getTime() && dataFatt.getTime() <= date2.getTime()
                  if(risultatoData){
                  }
                  else if(risultatoData===false){
                    console.log('tolta')
                    this.fatture.splice(i,1)
                  }
                }
                else{
                  console.log('tolta null')
                  this.fatture.splice(i,1)
                }
              }
            }
            if(this.stato==="PAGATA"||this.stato==="NON PAGATA"){
              this.fatture=this.fatture.filter(x=>x.stato.nome===this.stato)
            }
            let tempo= setTimeout(()=>{
              this.filterTotFattureAny()
              clearTimeout(tempo)
            },(this.pages*1.5))
          })).subscribe()
      }
      else if(this.pagesAmount>0){
        for(let i=this.pagesAmount-1;i>=0;i--){
          this.sub= this.fattureSrv.getByAmount(i,this.moneyStart,this.moneyEnd).pipe(tap((fatture)=>{
            this.Obj=fatture
            this.fatture=this.fatture.concat(this.Obj.content)
            console.log(this.fatture)
            if(this.stato==="PAGATA"||this.stato==="NON PAGATA"){
              this.fatture=this.fatture.filter(x=>x.stato.nome===this.stato)
            }
            if(this.dataStart!=null && this.dataEnd!=null){
              let date1=new Date(`${this.dataStart[0]}-${this.dataStart[1]}-${this.dataStart[2]}`)
              let date2=new Date(`${this.dataEnd[0]}-${this.dataEnd[1]}-${this.dataEnd[2]}`)
              console.log(date1, typeof date1)
              console.log(date2, typeof date2)
              for(let i=this.fatture.length-1;i>=0;i--){
                if(this.fatture[i].data!=null){
                  let dataFatt=new Date(Date.parse((this.fatture[i].data.toString())))
                  let risultatoData=date1.getTime() < dataFatt.getTime() && dataFatt.getTime() <= date2.getTime()
                  if(risultatoData){
                  }
                  else if(risultatoData===false){
                    console.log('tolta')
                    this.fatture.splice(i,1)
                  }
                }
                else{
                  console.log('tolta null')
                  this.fatture.splice(i,1)
                }
              }
            }
            if(i===0){
              let tempo= setTimeout(()=>{
                this.filterTotFattureAny()
                clearTimeout(tempo)
              },(this.pages*1.5))
            }
          })).subscribe()
        }
      }
    }

    else if(a==='Date'){
      console.log("DATE")
      if(this.pagesDate===0){
        this.fattureSrv.getBydate(

          0,
          `${this.dataStart[2]+'.'+this.dataStart[1]+'.'+this.dataStart[0]}`,
        `${this.dataEnd[2]+'.'+this.dataEnd[1]+'.'+this.dataEnd[0]}`

        ).pipe(tap((fatture)=>{
          this.Obj=fatture
          this.fatture=this.fatture.concat(this.Obj.content)
          console.log(this.fatture)
          if(this.moneyStart!=null&&this.moneyEnd!=null){
            this.fatture=this.fatture.filter(x=>this.moneyStart<x.importo && x.importo<this.moneyEnd)
          }
          if(this.stato==="PAGATA"||this.stato==="NON PAGATA"){
            this.fatture=this.fatture.filter(x=>x.stato.nome===this.stato)
          }
            let tempo= setTimeout(()=>{
              this.filterTotFattureAny()
              clearTimeout(tempo)
            },(this.pages*1.5))
        })).subscribe()
      }
      else if(this.pagesDate>0){
        for(let i=this.pagesDate-1;i>=0;i--){
          this.fattureSrv.getBydate(

            i,
            `${this.dataStart[2]+'.'+this.dataStart[1]+'.'+this.dataStart[0]}`,
          `${this.dataEnd[2]+'.'+this.dataEnd[1]+'.'+this.dataEnd[0]}`

          ).pipe(tap((fatture)=>{
            this.Obj=fatture
            this.fatture=this.fatture.concat(this.Obj.content)
            console.log(this.fatture)
            if(this.moneyStart!=null&&this.moneyEnd!=null){
              this.fatture=this.fatture.filter(x=>this.moneyStart<x.importo && x.importo<this.moneyEnd)
            }
            if(this.stato==="PAGATA"||this.stato==="NON PAGATA"){
              this.fatture=this.fatture.filter(x=>x.stato.nome===this.stato)
            }
            if(i===0){
              let tempo= setTimeout(()=>{
                this.filterTotFattureAny()
                clearTimeout(tempo)
              },(this.pages*1.5))
            }
          })).subscribe()
        }
      }

    }

    else if(a==='Stat'){
      console.log("STAT")
      console.log(this.pagesStat)
      if(this.pagesStat===0){
        this.sub = this.fattureSrv.getByStat(0,this.statoId).pipe(tap((fatture)=>{
          this.Obj=fatture
          this.fatture=this.fatture.concat(this.Obj.content)
          console.log(this.fatture)
          if(this.moneyStart!=null&&this.moneyEnd!=null){
            this.fatture=this.fatture.filter(x=>this.moneyStart<x.importo && x.importo<this.moneyEnd)
          }
          if(this.dataStart!=null && this.dataEnd!=null){
            let date1=new Date(`${this.dataStart[0]}-${this.dataStart[1]}-${this.dataStart[2]}`)
            let date2=new Date(`${this.dataEnd[0]}-${this.dataEnd[1]}-${this.dataEnd[2]}`)
            console.log(date1, typeof date1)
            console.log(date2, typeof date2)
            for(let i=this.fatture.length-1;i>=0;i--){
              if(this.fatture[i].data!=null){
                let dataFatt=new Date(Date.parse((this.fatture[i].data.toString())))
                let risultatoData=date1.getTime() < dataFatt.getTime() && dataFatt.getTime() <= date2.getTime()
                if(risultatoData){
                }
                else if(risultatoData===false){
                  console.log('tolta')
                  this.fatture.splice(i,1)
                }
              }
              else{
                console.log('tolta null')
                this.fatture.splice(i,1)
              }
            }
          }
          let tempo= setTimeout(()=>{
              this.filterTotFattureAny()
              clearTimeout(tempo)
          },(this.pages*1.5))
        })).subscribe()
      }
      else if(this.pagesStat>0){
        for(let i=this.pagesStat-1;i>=0;i--){
          console.log(i)
          this.sub = this.fattureSrv.getByStat(i,this.statoId).pipe(tap((fatture)=>{
            this.Obj=fatture
            this.fatture=this.fatture.concat(this.Obj.content)
            console.log(this.fatture)
            if(this.moneyStart!=null&&this.moneyEnd!=null){
              this.fatture=this.fatture.filter(x=>this.moneyStart<x.importo && x.importo<this.moneyEnd)
            }
            if(this.dataStart!=null && this.dataEnd!=null){
              console.log(this.dataStart,this.dataEnd)
              let date1=new Date(`${this.dataStart[0]}-${this.dataStart[1]}-${this.dataStart[2]}`)
              let date2=new Date(`${this.dataEnd[0]}-${this.dataEnd[1]}-${this.dataEnd[2]}`)
              for(let i=this.fatture.length-1;i>=0;i--){
                if(this.fatture[i].data!=null){
                  console.log(date1)
                  console.log(date2)
                  let dataFatt=new Date(Date.parse((this.fatture[i].data.toString())))
                  let risultatoData=date1.getTime() < dataFatt.getTime() && dataFatt.getTime() <= date2.getTime()
                  if(risultatoData){
                  }
                  else if(risultatoData===false){
                    console.log('tolta')
                    this.fatture.splice(i,1)
                  }
                }
                else{
                  console.log('tolta null')
                  this.fatture.splice(i,1)
                }
              }
            }
            if(i===0){
              let tempo= setTimeout(()=>{
                this.filterTotFattureAny()
                clearTimeout(tempo)
              },(this.pages*1.5))
            }
          })).subscribe()
        }
      }
    }
  }

  aggiungiOggettoAny(){
    this.fattureAny.push([])
  }

  filterTotFattureAny(){
    let countInterval=0
    let tempo=setInterval(()=>{
      this.fattureAny=[]
      this.counInterval++
      this.aggiungiOggettoAny()
      let count=-1
      console.log(this.fatture.length)
      for(let i=0;i<this.fatture.length;i++){
        if(i%20===0){
          this.aggiungiOggettoAny()
          count++
        }
        this.fattureAny[count].push(this.fatture[i])
      }
      console.log(this.fattureAny)
      if(countInterval>10){
        clearInterval(tempo)
      }
    },10000)
  }

  getDataStat(){
    let stato=(<HTMLInputElement>document.getElementById('paymentStatus')).value
    return stato
  }

  getFattbyStat(){
    let stato=this.getDataStat()
    console.log(stato)
    this.stato=stato
    if(this.stato==='NON PAGATA'){
      this.statoId=2
    }
    else if(this.stato==='PAGATA'){
      this.statoId=1
    }
    if(this.getDataStat().trim()===null||this.getDataStat().trim()===''){
      return false
    }
    else{
      if(this.getDataStat().trim()!=null && this.getDataStat().trim()!=''){
          this.sub = this.fattureSrv.getByStat(0,this.statoId).pipe(tap((fatture)=>{
            this.Obj=fatture
            this.arrayStat=this.Obj.content
            this.pagesStat=this.Obj.totalPages
            console.log(this.arrayStat)
        })).subscribe()
      }
      return true
    }
  }

  getDataDate(){
    let valStart=(<HTMLInputElement>document.getElementById('startDate')).value
    let valStartARR=valStart.split('-')
    let valEnd=(<HTMLInputElement>document.getElementById('finishDate')).value
    let valEndARR=valEnd.split('-')
    let date1=new Date(`${valStartARR[1]+'/'+valStartARR[2]+'/'+valStartARR[0]}`)
    let date2=new Date(`${valEndARR[1]+'/'+valEndARR[2]+'/'+valEndARR[0]}`)
    if(date1 < date2){
      return [valStartARR,valEndARR]
    }
    else{
      return null
    }
  }

  getFattByDateBeetween(){
    if(this.getDataDate()===null){

    }
    else{
      let arrayData=this.getDataDate()
      this.dataStart=arrayData![0]
      this.dataEnd=arrayData![1]

      this.fattureSrv.getBydate(

        0,
        `${this.dataStart[2]+'.'+this.dataStart[1]+'.'+this.dataStart[0]}`,
      `${this.dataEnd[2]+'.'+this.dataEnd[1]+'.'+this.dataEnd[0]}`

      ).pipe(tap((fatture)=>{
        this.Obj=fatture
        this.arrayDate=this.Obj.content
        this.pagesDate=this.Obj.totalPages

        console.log(this.arrayDate)
      })).subscribe()
    }
  }

  getDataMoney(){
    let valStart=(<HTMLInputElement>document.getElementById('startMoney')).value
    let valEnd=(<HTMLInputElement>document.getElementById('finishMoney')).value

    if(parseInt(valStart) < parseInt(valEnd)){
      return [parseInt(valStart),parseInt(valEnd)]
    }
    else{
      return null
    }
  }

  getFattByMoneyBeetween(){
    if(this.getDataMoney()===null){

    }
    else{
      let arrayData=this.getDataMoney()
      console.log(arrayData)
      this.moneyStart=arrayData![0]
      this.moneyEnd=arrayData![1]

     this.sub= this.fattureSrv.getByAmount(0,this.moneyStart,this.moneyEnd).pipe(tap((fatture)=>{
        this.Obj=fatture
        this.arrayAmount=this.Obj.content
        this.pagesAmount=this.Obj.totalPages
        console.log(this.arrayAmount)
      })).subscribe()
    }
  }


  ngOnDestroy(){
    this.sub.unsubscribe()
  }

}
