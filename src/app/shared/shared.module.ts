import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankAccountSummaryComponent } from 'src/app/components/bank-account/summary/bank-account-summary.component';
import { CcSummaryComponent } from 'src/app/components/cc/summary/cc-summary.component';
import { InvestmentSummaryComponent } from 'src/app/components/investment/summary/investment-summary.component';
import { LogoComponent } from 'src/app/components/logo/logo.component';

@NgModule({
  declarations: [
    BankAccountSummaryComponent,
    CcSummaryComponent,
    InvestmentSummaryComponent,
    LogoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    BankAccountSummaryComponent,
    CcSummaryComponent,
    InvestmentSummaryComponent,
    LogoComponent,

    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class SharedModule {}
