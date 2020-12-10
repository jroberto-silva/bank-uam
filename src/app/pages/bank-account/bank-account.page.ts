import { Component, OnInit } from '@angular/core';

import { BankAccount } from 'src/app/models/bank.account.model';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.page.html',
  styleUrls: ['./bank-account.page.scss'],
})
export class BankAccountPage implements OnInit {

  private bankAccount: BankAccount;
  private loadingBankAccount: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  public setBankAccount(bankAccount: BankAccount) {
    this.bankAccount = bankAccount;
  }

  public updateLoadingBankAccount(loading: boolean) {
    this.loadingBankAccount = loading;
  }
}
