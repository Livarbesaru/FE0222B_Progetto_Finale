import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard.guard';
import { UtentiComponent } from './utenti.component';


const routes: Routes = [
  {
  path: '',
  component:UtentiComponent,
  canActivate:[AuthGuard]
}
];

@NgModule({
  declarations:[
    UtentiComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class UtentiRoutingModule { }
