import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewClienteComponent } from './new-client.component';


const routes: Routes = [
  {
  path: '',
  component:NewClienteComponent
}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class NewClienteRoutingModule { }
