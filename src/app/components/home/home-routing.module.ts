import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard.guard';
import { HomeComponent } from './home.component';


const routes: Routes = [
  {
  path: '',
  component:HomeComponent,
  canActivate:[AuthGuard]
}
];

@NgModule({
  declarations:[
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class HomeRoutingModule { }
