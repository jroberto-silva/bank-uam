import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/auth/shared/auth-guard.guard';
import { LoginGuard } from 'src/app/auth/shared/login-guard.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'registration',
    canActivate: [LoginGuard],
    loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationPageModule)
  },
  {
    path: 'verify-email',
    canActivate: [LoginGuard],
    loadChildren: () => import('./verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
