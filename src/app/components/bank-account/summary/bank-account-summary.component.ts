/* tslint:disable:no-inferrable-types */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { BankAccount } from 'src/app/models/bank.account.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-bank-account-summary',
  templateUrl: './bank-account-summary.component.html',
  styleUrls: ['./bank-account-summary.component.scss'],
})
export class BankAccountSummaryComponent implements OnInit {

  @Input() public showHeader: boolean = true;
  @Output() public changeLoadingStatus = new EventEmitter<boolean>();
  @Output() public updateBankAccount = new EventEmitter<BankAccount>();

  public loading: boolean;
  public bankAccount: BankAccount;
  public bankAccountDocId: string;

  constructor(private bankAccountService: BankAccountService, private authService: AuthService) {
    authService.user.subscribe(user => this.loadBankAccount(user));
  }

  ngOnInit() {
    this.updateLoading(true);
  }

  private async loadBankAccount(user: User) {
    if (!user) {
      return;
    }

    await this.updateLoading(true);

    await this.bankAccountService.getUserBankAccounts(user)
      .then(snapshot => {

        if (snapshot.empty) {
          return;
        }

        const doc = snapshot.docs[0];

        this.bankAccount = doc.data() as BankAccount;
        this.bankAccountDocId = doc.id;

        this.updateBankAccount.emit(this.bankAccount);
      })
      .catch(error => console.log(error));

    this.updateLoading(false);
  }

  public updateLoading(loading: boolean) {
    this.loading = loading;
    this.changeLoadingStatus.emit(loading);
  }
}
