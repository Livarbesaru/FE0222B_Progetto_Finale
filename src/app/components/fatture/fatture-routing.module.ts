import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard.guard';
import { FattureComponent } from './fatture.component';


const routes: Routes = [
  {
  path: '',
  component:FattureComponent,
  canActivate:[AuthGuard]
}
];

@NgModule({
  declarations:[
    FattureComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class FattureRoutingModule { }
