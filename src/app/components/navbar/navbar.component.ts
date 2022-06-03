import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn!:boolean

  constructor(private AuthSrv:AuthService) { }

  ngOnInit(): void {
    this.AuthSrv.isLoggedIn$.subscribe((islogged)=>{
      this.isLoggedIn=islogged
    })
  }

  logOut(){
    this.AuthSrv.logout()
  }
}
