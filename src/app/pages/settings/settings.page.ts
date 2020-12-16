import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { BankAccount } from 'src/app/models/bank.account.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public user: User;
  public bankAccount: BankAccount;
  public loadingBankAccount: boolean;

  constructor(public authService: AuthService, private bankAccountService: BankAccountService) {
    authService.user.subscribe(user => this.loadBankAccount(user));
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
  }

  private async loadBankAccount(user: User) {
    if (!user) {
      return;
    }

    this.loadingBankAccount = true;

    await this.bankAccountService.getUserBankAccounts(user)
      .then(snapshot => {
        this.bankAccount = snapshot.empty ? null : snapshot.docs[0].data() as BankAccount;
      })
      .finally(() => this.loadingBankAccount = false);
  }
}
