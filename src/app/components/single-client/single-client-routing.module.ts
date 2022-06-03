import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard.guard';
import { SingleClientComponent } from './single-client.component';


const routes: Routes = [
  {
  path: '',
  component:SingleClientComponent,
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
export class SingleClientRoutingModule { }
