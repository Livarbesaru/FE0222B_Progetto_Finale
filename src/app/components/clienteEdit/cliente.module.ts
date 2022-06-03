import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteComponent } from './cliente.component';
import { ClienteRoutingModule } from './cliente-routing.module';



@NgModule({
  declarations: [
    ClienteComponent
  ],
  imports: [
    ReactiveFormsModule,
    ClienteRoutingModule,
    CommonModule
  ]
})
export class ClienteModule { }
