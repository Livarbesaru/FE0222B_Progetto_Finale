import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-service.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private FormBuilder: FormBuilder,private AuthSrv:AuthService, private router:Router) {}

  ngOnInit(): void {
    this.form =
    this.FormBuilder.group({
      utente: this.FormBuilder.group({
        username: this.FormBuilder.control(null, [
          Validators.required
        ]),
        password: this.FormBuilder.control(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      }),
    });

    this.autoLogin()
  }

  autoLogin(){
    if(sessionStorage.getItem('user')){
      this.AuthSrv.autoLogin()
    }
  }

  controlloType(tipo: string) {
    return this.form.get(tipo);
  }
  errorType(tipo: string, error: string) {
    return this.form.get(tipo)?.errors![error];
  }

  login(form: any) {
    let user=sessionStorage.getItem('user')
    if(!user){
      console.log('log')
      this.AuthSrv.submitLogin(form.value.utente).subscribe()
    }
    else{
      console.log('autolog')
      this.autoLogin()
    }
  }
}
