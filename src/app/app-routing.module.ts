import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.guard';
import { FormModuleGuard } from './auth/form-module-guard.guard';


const routes: Routes = [
  {
    canActivateChild:[AuthGuard],
    path: '',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
  },
  {
    canActivateChild:[FormModuleGuard],
    path: 'login',
    loadChildren: () => import('./auth/components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/components/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    canActivateChild:[AuthGuard],
    path: 'clienti',
    loadChildren: () => import('./components/clienti/clienti.module').then(m => m.ClientiModule)
  },
  {
    canActivateChild:[AuthGuard],
    path: 'cliente/:id',
    loadChildren: () => import('./components/single-client/single-client.module').then(m => m.SingleClientModule)
  },
  {
    canActivateChild:[AuthGuard],
    path: 'utenti',
    loadChildren: () => import('./components/utenti/utenti.module').then(m => m.UtentiModule)
  },
  {
    canActivateChild:[AuthGuard],
    path: 'fatture',
    loadChildren: () => import('./components/fatture/fatture.module').then(m => m.fattureModule)
  }
  ,
  {
    canActivateChild:[AuthGuard],
    path: 'fattura/:id/:userId',
    loadChildren: () => import('./components/fattura/fattura.module').then(m => m.FatturaModule)
  },
  {
    canActivateChild:[AuthGuard],
    path: 'clienteEdit/:id',
    loadChildren: () => import('./components/clienteEdit/cliente.module').then(m => m.ClienteModule)
  },
  {
    canActivateChild:[AuthGuard],
    path: 'newcliente',
    loadChildren: () => import('./components/new-client/new-client.module').then(m => m.NewClienteModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
