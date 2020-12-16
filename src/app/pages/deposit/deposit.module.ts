import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { DepositPageRoutingModule } from './deposit-routing.module';
import { DepositPage } from './deposit.page';

@NgModule({
  imports: [
    SharedModule,
    DepositPageRoutingModule
  ],
  declarations: [DepositPage]
})
export class DepositPageModule {}
