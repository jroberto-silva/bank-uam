/* tslint:disable */
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { BankAccountPageRoutingModule } from './bank-account-routing.module';
import { BankAccountPage } from './bank-account.page';
import { BankAccount } from 'src/app/models/bank.account.model';

@NgModule({
  imports: [
    SharedModule,
    BankAccountPageRoutingModule
  ],
  declarations: [BankAccountPage]
})
export class BankAccountPageModule {
  public bankAccount: BankAccount;
  public loadingBankAccount: boolean = true;

  public setBankAccount(bankAccount: BankAccount) {
    this.bankAccount = bankAccount;
  }

  public setLoadingBankAccount(loading: boolean) {
    this.loadingBankAccount = loading;
  }
}

