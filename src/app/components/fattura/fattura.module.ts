import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { FatturaComponent } from './fattura.component';
import { CommonModule } from '@angular/common';
import { FatturaRoutingModule } from './fattura-routing.module';



@NgModule({
  declarations: [
    FatturaComponent
  ],
  imports: [
    ReactiveFormsModule,
    FatturaRoutingModule,
    CommonModule
  ]
})
export class FatturaModule { }
