import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard.guard';
import { ClientiComponent } from './clienti.component';


const routes: Routes = [
  {
  path: '',
  component:ClientiComponent,
  canActivate:[AuthGuard]
}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class ClientiRoutingModule { }
