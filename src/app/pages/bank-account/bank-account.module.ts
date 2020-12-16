/* tslint:disable */
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { BankAccountPageRoutingModule } from './bank-account-routing.module';
import { BankAccountPage } from './bank-account.page';

@NgModule({
  imports: [
    SharedModule,
    BankAccountPageRoutingModule
  ],
  declarations: [BankAccountPage]
})
export class BankAccountPageModule {
}
