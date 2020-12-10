import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordPage } from './forgot-password.page';
import { ForgotPasswordEmailPage } from './forgot-password-email.page';
import { LoginGuard } from 'src/app/guards/login-guard.guard';
import { SameRouteGuardGuard } from 'src/app/guards/same-route-guard.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
    component: ForgotPasswordPage
  },
  {
    path: 'email',
    canActivate: [LoginGuard, SameRouteGuardGuard],
    component: ForgotPasswordEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordPageRoutingModule {
}
