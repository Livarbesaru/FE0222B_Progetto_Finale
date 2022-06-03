import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { SingleClientRoutingModule } from './single-client-routing.module';
import { SingleClientComponent } from './single-client.component';



@NgModule({
  declarations: [
    SingleClientComponent
  ],
  imports: [
    CommonModule,
    SingleClientRoutingModule,
    ReactiveFormsModule
  ]
})
export class SingleClientModule { }
