import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { TransferPageRoutingModule } from './transfer-routing.module';
import { TransferPage } from './transfer.page';

@NgModule({
  imports: [
    SharedModule,
    TransferPageRoutingModule
  ],
  declarations: [TransferPage]
})
export class TransferPageModule {
}
