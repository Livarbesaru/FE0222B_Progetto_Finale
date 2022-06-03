import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule,
    LoginRoutingModule,
    FormsModule,
    CommonModule
  ]
})
export class LoginModule { }
