import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { RegistrationPageRoutingModule } from './registration-routing.module';
import { RegistrationPage } from './registration.page';

@NgModule({
  imports: [
    SharedModule,
    RegistrationPageRoutingModule
  ],
  declarations: [RegistrationPage]
})
export class RegistrationPageModule {
}
