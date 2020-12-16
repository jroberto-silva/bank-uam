import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxCurrencyModule } from 'ngx-currency';

import { BankAccountSummaryComponent } from 'src/app/components/bank-account/summary/bank-account-summary.component';
import { BankAccountTransactionsComponent } from 'src/app/components/bank-account/transactions/bank-account-transactions.component';
import { CcSummaryComponent } from 'src/app/components/cc/summary/cc-summary.component';
import { InvestmentSummaryComponent } from 'src/app/components/investment/summary/investment-summary.component';
import { LogoComponent } from 'src/app/components/logo/logo.component';

@NgModule({
  declarations: [
    BankAccountSummaryComponent,
    BankAccountTransactionsComponent,
    CcSummaryComponent,
    InvestmentSummaryComponent,
    LogoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxCurrencyModule
  ],
  exports: [
    BankAccountSummaryComponent,
    BankAccountTransactionsComponent,
    CcSummaryComponent,
    InvestmentSummaryComponent,
    LogoComponent,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxCurrencyModule,
    BankAccountTransactionsComponent
  ]
})
export class SharedModule {}
