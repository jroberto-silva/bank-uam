import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { BankAccount } from 'src/app/models/bank.account.model';
import { User } from 'src/app/models/user.model';

// noinspection JSMethodCanBeStatic
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
      .where('uid', '==', user.uid)
      .get();
  }

  saveBankAccount(bankAccount: BankAccount) {
    return this.angularFirestore
      .collection('bank-accounts')
      .doc(this.makeBankAccountId(bankAccount))
      .set(bankAccount, { merge: true });
  }

  createBankAccount(user: User) {
    const bankAccount: BankAccount = {
      agency: this.DEFAULT_AGENCY,
      number: this.generateNewAccountNumber(),
      digit: Math.floor(Math.random() * 10),
      balance: 0.00,
      uid: user.uid,
      creationDate: firebase.firestore.Timestamp.now()
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

  /**
   * Retorna o id que um model bankModel terá na collection bank-accounts
   *
   * @param {BankAccount} bankAccount
   * @private
   */
  private makeBankAccountId(bankAccount: BankAccount): string {
    return bankAccount.uid + '-' + bankAccount.agency + '-' + bankAccount.number;
  }
}
