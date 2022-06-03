import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewClienteComponent } from './new-client.component';
import { NewClienteRoutingModule } from './new-client-routing.module';




@NgModule({
  declarations: [
    NewClienteComponent
  ],
  imports: [
    ReactiveFormsModule,
    NewClienteRoutingModule,
    CommonModule
  ]
})
export class NewClienteModule { }
