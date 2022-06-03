import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-service.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;


  constructor(private FormBuilder: FormBuilder, private AuthSrv:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.form =
    this.FormBuilder.group({
      utente: this.FormBuilder.group({
        email: this.FormBuilder.control(null, [
          Validators.required,
          Validators.email,
        ]),
        password: this.FormBuilder.control(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        username: this.FormBuilder.control(null, [
          Validators.required,
          Validators.minLength(4)
        ]),
        name: this.FormBuilder.control(null, [
          Validators.required,
        ]),
        lastName: this.FormBuilder.control(null, [
          Validators.required,
        ]),
        role: this.FormBuilder.control(null, [
          Validators.required
        ])
      }),
    });
  }

  controlloType(tipo: string) {
    return this.form.get(tipo);
  }
  errorType(tipo: string, error: string) {
    return this.form.get(tipo)?.errors![error];
  }

  submitRegi(form:any){
    console.log(form.value.utente)
    let dataForm={
      username:<string>form.value.utente.username,
      email:<string>form.value.utente.email,
      password:<string>form.value.utente.password,
      nome:<string>(form.value.utente.name),
      cognome:<string>(form.value.utente.lastName),
      role:[""]
    }
    dataForm.role.splice(0,1)
    dataForm.role.push(form.value.utente.role)
    console.log(dataForm)
        this.AuthSrv.submitRegistration(dataForm).subscribe(
      (ris)=>{
        console.log(ris)
        this.router.navigate(['/login'])
      }
    )
  }
}
/* console.log(form.value.utente)
let dataForm={
  username:<string>form.value.utente.username,
  email:<string>form.value.utente.email,
  password:<string>form.value.utente.password,
  nome:<string>form.value.utente.name,
  cognome:<string>form.value.utente.lastName,
  role:['']
}
dataForm.role.splice(0,1)
dataForm.role.push(form.value.utente.role)
console.log(dataForm)
    this.AuthSrv.submitRegistration(dataForm).subscribe(
  (ris)=>{
    console.log(ris)
  }
)
} */
