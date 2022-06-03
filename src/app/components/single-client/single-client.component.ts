import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignleClientService } from 'src/app/service/single-client.service';
import { Params, ActivatedRoute, Router} from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Fattura } from 'src/app/interface/fattura';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';

@Component({
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.scss']
})
export class SingleClientComponent implements OnInit {

  constructor(private SinglClient:SignleClientService, private router:ActivatedRoute, private routeTo:Router, private FormBuilder: FormBuilder) { }
  client!:any
  sub!:Subscription
  id!:number
  fatture:Fattura[]=[]
  fattureCanvas:Fattura[]=[]
  momentOBJ!:any
  pages!:number
  pagina:number=0
  filterControl:boolean=false
  caricamento:boolean=false
  fattPagate:Fattura[]=[]
  fattNonPagate:Fattura[]=[]
  form!: FormGroup;

  ngOnInit(): void {
    this.caricamento=true
    this.filterControl=false
    this.sub = this.router.params.subscribe((params: Params) =>{
      this.id = +params['id'];
    });

    this.sub = this.SinglClient.getClient(this.id).pipe(tap((client)=>{
      this.client=client
    })).subscribe()

    this.getfatture()
    this.getAllFatt()
    setTimeout(()=>{
      this.draw()
      console.log(this.fattNonPagate)
      console.log(this.fattPagate)
    },3000)


    this.form =
    this.FormBuilder.group({
      fattura: this.FormBuilder.group({
        importo: this.FormBuilder.control(null, [
          Validators.required
        ]),
        stato: this.FormBuilder.control(null, [
          Validators.required
        ])
      }),
    });
  }

  getfatture(){
    this.caricamento=true
    this.sub=this.SinglClient.getFatture(this.id).pipe(tap((fatture)=>{
      this.momentOBJ=fatture
      this.pages=this.momentOBJ.totalPages
      this.fatture=this.momentOBJ.content
      console.log(this.client)
      console.log(this.fatture)
      this.caricamento=false
    })).subscribe()
  }

  getfatturePages(i:number){
    this.caricamento=true
    this.sub=this.SinglClient.getFatturePage(this.id,i).pipe(tap((fatture)=>{
      this.momentOBJ=fatture
      this.fatture=this.momentOBJ.content
      this.caricamento=false
    })).subscribe()
  }

  getAllFatt(){
    this.fattureCanvas=[]
    this.sub=this.SinglClient.getFatture(this.id).pipe(tap((fatture)=>{
      this.momentOBJ=fatture
      this.fattureCanvas=this.momentOBJ.content
      if(this.momentOBJ.totalPages>1){
        for(let i=this.momentOBJ.totalPages;i>0;i--){
          this.sub=this.SinglClient.getFatturePage(this.id,i).pipe(tap((fatture)=>{
            this.momentOBJ=fatture
            this.fattureCanvas=this.fattureCanvas.concat(this.momentOBJ.content)
            console.log(this.fattureCanvas)
          })).subscribe()
        }
      }
      else{
        this.fattureCanvas=this.momentOBJ.content
      }
    })).subscribe()
  }

  deleteFatt(id:number){
    this.sub= this.SinglClient.deleteFatt(id).subscribe()
    this.refreshPage()
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

  goToPages(id:number){
    this.routeTo.navigate(['/'])
    this.routeTo.navigate(['/fattura',id,this.id])
  }

  getData(){
    let valStart=(<HTMLInputElement>document.getElementById('startDate')).value
    let valStartARR=valStart.split('-')
    let valEnd=(<HTMLInputElement>document.getElementById('finishDate')).value
    let valEndARR=valEnd.split('-')
    /* let dateStart=valStartARR[2]+'.'+valStartARR[1]+'.'+valStartARR[0] */
    /* let dateEnd=valEndARR[2]+'.'+valEndARR[1]+'.'+valEndARR[0] */
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
    if(this.getData()===null){

    }
    else{
      let arrayData=this.getData()
      let dateStart:string[]=arrayData![0]
      let dateEnd:string[]=arrayData![1]
      let date1=new Date(`${dateStart[1]+'/'+dateStart[2]+'/'+dateStart[0]}`)
      let date2=new Date(`${dateEnd[1]+'/'+dateEnd[2]+'/'+dateEnd[0]}`)
      if(this.filterControl===true){
        this.filterControl=true
        if(this.fatture.length>0){
          for(let c=this.fatture.length-1;c>=0;c--){
            console.log(this.fatture)
            let objDate:Date=new Date(Date.parse(this.fatture[c].data.toString()))
            console.log(objDate.getTime())
            let dateControl=(objDate.getTime()>date1.getTime() && objDate.getTime()<=date2.getTime())
            if(dateControl){
            }
            else{
              this.fatture.splice(c,1)
            }
          }
        }
      }
      else{
        this.fatture=[]
        this.filterControl=true
        this.sub=this.SinglClient.getFatture(this.id).pipe(tap((fatture)=>{
          this.momentOBJ=fatture
          this.pages=this.momentOBJ.totalPages
          if(this.pages===0){
            this.sub=this.SinglClient.getFatturePage(this.id,0).pipe(tap((fatture)=>{
              this.momentOBJ=fatture
              this.fatture=this.fatture.concat(this.momentOBJ.content)
              for(let c=this.fatture.length-1;c>=0;c--){
                console.log(this.fatture)
                let objDate:Date=new Date(Date.parse(this.fatture[c].data.toString()))
                console.log(objDate.getTime())
                let dateControl=(objDate.getTime()>date1.getTime() && objDate.getTime()<=date2.getTime())
                if(dateControl){
                }
                else{
                  this.fatture.splice(c,1)
                }
              }
            })).subscribe()
          }
          else if(this.pages>0){
            for(let i=this.pages-1;i>=0;i--){
              this.sub=this.SinglClient.getFatturePage(this.id,i).pipe(tap((fatture)=>{
                this.momentOBJ=fatture
                this.fatture=this.fatture.concat(this.momentOBJ.content)
                for(let c=this.fatture.length-1;c>=0;c--){
                  console.log(this.fatture)
                  let objDate:Date=new Date(Date.parse(this.fatture[c].data.toString()))
                  console.log(objDate.getTime())
                  let dateControl=(objDate.getTime()>date1.getTime() && objDate.getTime()<=date2.getTime())
                  if(dateControl){
                  }
                  else{
                    this.fatture.splice(c,1)
                  }
                }
              })).subscribe()
            }
          }
        })).subscribe()
      }
    }
  }

  getDataStat(){
   let stato=(<HTMLInputElement>document.getElementById('paymentStatus')).value
   return stato
  }

  getFattbyStat(){
    console.log(this.filterControl+'   '+this.getDataStat().trim())
    if(this.getDataStat().trim()===null||this.getDataStat().trim()===''){
    }
    else{
      if(this.filterControl===true && (this.getDataStat().trim()!=null && this.getDataStat().trim()!='')){
        if(this.fatture.length>0){
          for(let c=this.fatture.length-1;c>=0;c--){
            console.log(this.fatture)
            let objStatus:string=this.fatture[c].stato.nome
            let dateControl=objStatus===this.getDataStat()
            if(dateControl){
            }
            else{
              this.fatture.splice(c,1)
            }
          }
        }
      }
      else if(this.filterControl===false && (this.getDataStat().trim()!=null && this.getDataStat().trim()!='')){
        this.fatture=[]
        this.filterControl=true
        this.sub=this.SinglClient.getFatture(this.id).pipe(tap((fatture)=>{
          this.momentOBJ=fatture
          this.pages=this.momentOBJ.totalPages
          if(this.pages===0){
            this.sub=this.SinglClient.getFatturePage(this.id,0).pipe(tap((fatture)=>{
              this.momentOBJ=fatture
              this.fatture=this.fatture.concat(this.momentOBJ.content)
              for(let c=this.fatture.length-1;c>=0;c--){
                console.log(this.fatture)
                let objStatus:string=this.fatture[c].stato.nome
                let dateControl=objStatus===this.getDataStat()
                if(dateControl){
                }
                else{
                  this.fatture.splice(c,1)
                }
              }
            })).subscribe()
          }
          else if(this.pages>0){
            for(let i=this.momentOBJ.totalPages;i>0;i--){
              this.sub=this.SinglClient.getFatturePage(this.id,i).pipe(tap((fatture)=>{
                this.momentOBJ=fatture
                this.fatture=this.fatture.concat(this.momentOBJ.content)
                for(let c=this.fatture.length-1;c>=0;c--){
                  console.log(this.fatture)
                  let objStatus:string=this.fatture[c].stato.nome
                  let dateControl=objStatus===this.getDataStat()
                  if(dateControl){
                  }
                  else{
                    this.fatture.splice(c,1)
                  }
                }
              })).subscribe()
            }
          }
        })).subscribe()
      }
    }
  }

  circleGraph(){
      let data = [
        {name:'pagate', fattNum:this.fattPagate.length},
        {name:'non_pagate', fattNum:this.fattNonPagate.length}
    ];

    const canvas = <HTMLCanvasElement>document.getElementById('chartContainer');
    const ctx = canvas.getContext('2d');
    let startAngle=0
    let tot=data[0].fattNum+data[1].fattNum
    data.forEach(element => {
      if(element.name==='pagate'){
        ctx!.fillStyle = 'green';
      }
      else if(element.name==='non_pagate'){
        ctx!.fillStyle = 'red';
      }
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = '#333';
      ctx!.beginPath();
      let radius=70

      let endAngle = ((element.fattNum / tot) * Math.PI * 2) + startAngle;
      ctx!.moveTo(canvas.width/2, canvas.height/2);
      ctx!.arc(canvas.width/2, canvas.height/2, radius, startAngle, endAngle, false);
      ctx!.lineTo(canvas.width/2, canvas.height/2);
      ctx!.fill();
      ctx!.stroke();
      ctx!.closePath();
      startAngle=endAngle
    })
  }

  rectanGraph(){
    let canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');

    let width = canvas.width/this.fattureCanvas.length;
    let X = 0;
    let averageTot =0
    for (let i =0; i<this.fattureCanvas.length; i++) {
      averageTot+=this.fattureCanvas[i].importo
    }
    averageTot=averageTot/this.fattureCanvas.length
    for (let i =0; i<this.fattureCanvas.length; i++) {
        ctx!.fillStyle = '#008080';
        let h:number =this.fattureCanvas[i].importo;
        if(this.fattureCanvas[i].stato.nome==='NON PAGATA'){
          ctx!.fillStyle = 'red';
        }
        else if(this.fattureCanvas[i].stato.nome==='PAGATA'){
          ctx!.fillStyle = 'green';
        }
        ctx!.fillRect(X,canvas.height-((h/averageTot)*canvas.height),width,(h/averageTot)*canvas.height);

        X +=  width+(1/this.fattureCanvas.length);
    }
  }

  draw() {
    this.fattPagate=this.fattureCanvas.filter(x=>x.stato.nome==='PAGATA')
    this.fattNonPagate=this.fattureCanvas.filter(x=>x.stato.nome==='NON PAGATA')
    console.log(this.fattPagate)
    console.log(this.fattNonPagate)
    this.circleGraph()
    this.rectanGraph()
  }

  refreshPage(){
    setTimeout(()=>{
      window.location.reload();
    },1000)
  }

  submitRegi(form:any){
    if((<string>form.value.fattura.stato).trim()===''||form.value.fattura.stato==null){

   }
   else{
     let anno=new Date
     console.log(form.value.fattura.stato)
     let dataForm={
       data:new Date(),
       numero: 0,
       anno: parseInt(anno.getFullYear().toString()),
       importo: parseInt(form.value.fattura.importo),
       stato: {
           id: 0,
           nome: form.value.fattura.stato
       },
       cliente: {
           id: this.client.id
       }
     }
     if(form.value.fattura.stato==='PAGATA'){
       dataForm.stato.id=1
     }
     else if(form.value.fattura.stato==='NON PAGATA'){
       dataForm.stato.id=2
     }
     console.log(dataForm)
     this.sub=this.SinglClient.newFattura(dataForm).subscribe()
     this.refreshPage()
   }
 }

 goToClientEdit(id:number){
  this.routeTo.navigate(['/'])
  this.routeTo.navigate(['clienteEdit/',id])
 }

  ngOnDestroy(){
    this.filterControl=false
    this.sub.unsubscribe()
  }

}
