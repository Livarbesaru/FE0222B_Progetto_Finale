import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormModuleGuard } from '../../form-module-guard.guard';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
  path: '',
  component:LoginComponent,
  canActivate:[FormModuleGuard]
}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class LoginRoutingModule { }
