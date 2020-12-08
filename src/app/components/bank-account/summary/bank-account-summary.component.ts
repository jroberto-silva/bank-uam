import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';

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

  public loading: boolean;
  public bankAccount: BankAccount | DocumentData;

  constructor(private bankAccountService: BankAccountService, private authService: AuthService) {
    authService.user.subscribe(user => this.loadBankAccount(user));
  }

  ngOnInit() {
  }

  private async loadBankAccount(user: User) {
    this.loading = true;

    await this.bankAccountService.getBankAccount(user)
      .then(snapshot => {

        if (snapshot.empty) {
          return;
        }

        this.bankAccount = snapshot.docs[0].data();
      })
      .catch(error => console.log(error));

    this.loading = false;
  }
}
