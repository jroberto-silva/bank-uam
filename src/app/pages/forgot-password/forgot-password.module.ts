import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordPage } from './forgot-password.page';
import { ForgotPasswordEmailPage } from './forgot-password-email.page';

@NgModule({
  imports: [
    SharedModule,
    ForgotPasswordPageRoutingModule
  ],
  declarations: [ForgotPasswordPage, ForgotPasswordEmailPage]
})
export class ForgotPasswordPageModule {
}
