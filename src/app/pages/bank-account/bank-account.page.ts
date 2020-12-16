import { Component, OnInit } from '@angular/core';

import { BankAccount } from 'src/app/models/bank.account.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.page.html',
  styleUrls: ['./bank-account.page.scss'],
})
export class BankAccountPage implements OnInit {

  bankAccount = new BehaviorSubject<BankAccount>(undefined);
  loadingBankAccount: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  public updateBankAccount(bankAccount: BankAccount) {
    this.bankAccount.next(bankAccount);
  }

  public updateLoadingBankAccount(loading: boolean) {
    this.loadingBankAccount = loading;
  }
}
