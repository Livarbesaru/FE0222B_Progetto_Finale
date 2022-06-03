import { Component, OnInit , OnDestroy } from '@angular/core';
import { UtentiService } from 'src/app/service/utenti.service';
import { Subscription, tap } from 'rxjs';

@Component({
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.scss']
})
export class UtentiComponent implements OnInit {
  users!:any
  pages:number[]=[]
  sub!:Subscription

  constructor(private UteSrv:UtentiService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.sub=this.UteSrv.getUsers().pipe(tap((users)=>{
      this.users=users
      this.pages=[...Array(this.users.totalPages).keys()]
      console.log(this.pages)
      console.log(this.users)
      this.users=this.users.content
    })).subscribe()
  }

  getUsersPages(i:number){
    this.sub=this.UteSrv.getUsersPages(i).pipe(tap((users)=>{
      this.users=users
      this.users=this.users.content
    })).subscribe()
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

}
