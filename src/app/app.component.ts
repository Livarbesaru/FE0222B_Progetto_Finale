import { Component , OnInit} from '@angular/core';
import { AuthService } from './auth/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Progetto-settimana-12';

  constructor(private AuthSrv:AuthService){
  }

  ngOnInit(){
    this.AuthSrv.autoLogin()
  }
}
