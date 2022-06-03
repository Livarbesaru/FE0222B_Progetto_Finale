import { NgModule } from '@angular/core';
import { SignUpRoutingModule } from './signup-routing.module';
import { ReactiveFormsModule} from '@angular/forms';
import { SignupComponent } from './signup.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    ReactiveFormsModule,
    SignUpRoutingModule,
    CommonModule
  ]
})
export class SignUpModule { }
