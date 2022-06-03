import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { HomeService } from 'src/app/service/home.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private HomeSrv:HomeService, private router:ActivatedRoute, private routeTo:Router) { }
  sub!:Subscription
  momentOBJ!:any
  pages!:number
  fattPagate!:number
  fattNonPagate!:number
  intervalloCount=0
  intervallo!:any
  clienti!:number
  clientiRicchi!:number
  clientialta!:number
  clientiMediAlta!:number
  clientiMedi!:number
  clientiNonAbb!:number

  ngOnInit(): void {
    this.getAllFatt()
    this.intervallo=setTimeout(()=>{
      this.draw()
    },3000)
  }

  getAllFatt(){
       this.sub=this.HomeSrv.getFatture(2).pipe(tap((fatture)=>{

      this.momentOBJ=fatture
      console.log(this.momentOBJ)
      this.fattNonPagate=this.momentOBJ.totalElements

      this.sub=this.HomeSrv.getFatture(1).pipe(tap((fatture)=>{
        this.momentOBJ=fatture
        console.log(this.momentOBJ)
        this.fattPagate=this.momentOBJ.totalElements

        this.sub=this.HomeSrv.getClients().pipe(tap((clients)=>{
          this.momentOBJ=clients
          this.clienti=this.momentOBJ.totalElements

          this.sub=this.HomeSrv.getClientsBudget(-15000,15000).pipe(tap((clients)=>{
            this.momentOBJ=clients
            this.clientiNonAbb=this.momentOBJ.totalElements

            this.sub=this.HomeSrv.getClientsBudget(15000,25000).pipe(tap((clients)=>{
              this.momentOBJ=clients
              this.clientiMedi=this.momentOBJ.totalElements

              this.sub=this.HomeSrv.getClientsBudget(25000,40000).pipe(tap((clients)=>{
                this.momentOBJ=clients
                this.clientiMediAlta=this.momentOBJ.totalElements

                this.sub=this.HomeSrv.getClientsBudget(40000,70000).pipe(tap((clients)=>{
                  this.momentOBJ=clients
                  this.clientialta=this.momentOBJ.totalElements

                    this.sub=this.HomeSrv.getClientsBudget(70000,100000000).pipe(tap((clients)=>{
                      this.momentOBJ=clients
                      this.clientiRicchi=this.momentOBJ.totalElements

                      this.intervallo=setTimeout(()=>{
                        this.draw()
                      },100)
                  })).subscribe()
                })).subscribe()
              })).subscribe()
            })).subscribe()
          })).subscribe()
        })).subscribe()
      })).subscribe()
    })).subscribe()
  }


  circleGraph(){
      let data = [
        {name:'pagate', fattNum:this.fattPagate},
        {name:'non_pagate', fattNum:this.fattNonPagate}
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

    let height = canvas.height/3;
    let X = 0;

    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'red';
    ctx!.fillRect(X,canvas.height/1.5,(this.fattPagate/(this.fattPagate+this.fattNonPagate))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`Non pagate: ${this.fattPagate}`, ((this.fattPagate/(this.fattPagate+this.fattNonPagate))*canvas.width)/2, canvas.height/1.1);


    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'green';
    ctx!.fillRect(X,canvas.height/15,(this.fattNonPagate/(this.fattPagate+this.fattNonPagate))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`Pagate: ${this.fattNonPagate}`, ((this.fattNonPagate/(this.fattPagate+this.fattNonPagate))*canvas.width)/2, canvas.height/4);

  }

  rectanGraphBudget(){
    let totBudget=this.clientiRicchi+this.clientialta+this.clientiMediAlta+this.clientiMedi+this.clientiNonAbb
    let canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myCanvasRendimento');
    let ctx = canvas.getContext('2d');

    let height = canvas.height/5;
    let X = 0;
    let altezza=(canvas.height-height)

    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'red';
    ctx!.fillRect(X,altezza,(this.clientiNonAbb/(totBudget))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`N.Clienti: ${this.clientiNonAbb}`, ((this.clientiNonAbb/totBudget)*canvas.width)/2, altezza+(height/2));

    altezza-=height

    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'darkorange';
    ctx!.fillRect(X,altezza,(this.clientiMedi/(totBudget))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`N.Clienti: ${this.clientiMedi}`, ((this.clientiMedi/totBudget)*canvas.width)/2, altezza+(height/2));

    altezza-=height

    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'darkyellow';
    ctx!.fillRect(X,altezza,(this.clientiMediAlta/(totBudget))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`N.Clienti: ${this.clientiMediAlta}`, ((this.clientiMediAlta/totBudget)*canvas.width)/2, altezza+(height/2));

    altezza-=height

    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'greenyellow';
    ctx!.fillRect(X,altezza,(this.clientialta/(totBudget))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`N.Clienti: ${this.clientialta}`, ((this.clientialta/totBudget)*canvas.width)/2, altezza+(height/2));

    altezza-=height

    ctx!.fillStyle = '#008080';

    ctx!.fillStyle = 'green';
    ctx!.fillRect(X,altezza,(this.clientiRicchi/(totBudget))*canvas.width, height);
    ctx!.fillStyle = 'black';
    ctx!.font = "15px Arial";
    ctx!.fillText(`N.Clienti: ${this.clientiRicchi}`, ((this.clientiRicchi/totBudget)*canvas.width)/2, altezza+(height/2));

  }

  draw() {
    this.intervalloCount++
     if(this.intervalloCount>6){
      clearInterval(this.intervallo)
    }
    console.log(this.fattPagate)
    console.log(this.fattNonPagate)
    this.circleGraph()
    this.rectanGraph()
    this.rectanGraphBudget()
  }

}
