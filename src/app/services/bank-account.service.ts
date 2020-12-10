import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { BankAccount } from 'src/app/models/bank.account.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  readonly ACCOUNT_LENGTH = 5;
  readonly DEFAULT_AGENCY = 1;

  constructor(private angularFirestore: AngularFirestore) { }

  getUserBankAccounts(user: User) {
    return this.angularFirestore
      .firestore
      .collection('bank-accounts')
      .where('userId', '==', user.uid)
      .get();
  }

  saveBankAccount(bankAccount: BankAccount) {
    return this.angularFirestore.collection('bank-accounts').add(bankAccount);
  }

  createBankAccount(user: User) {
    const bankAccount: BankAccount = {
      agency: this.DEFAULT_AGENCY,
      number: this.generateNewAccountNumber(),
      digit: Math.floor(Math.random() * 10),
      balance: 0.00,
      userId: user.uid,
      creationDate: new Date().toUTCString()
    };

    return this.saveBankAccount(bankAccount);
  }

  /**
   * Gera um número de conta com ACCOUNT_LENGTH dígitos. Ao longo da criação, atualmente não verificamos se já existe tal conta.
   * @private
   */
  private generateNewAccountNumber() {
    return Math.floor(Math.random() * (Math.pow(10, this.ACCOUNT_LENGTH) - 1));
  }
}
