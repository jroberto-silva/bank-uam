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

  getBankAccount(id: string) {
    return this.angularFirestore
      .firestore
      .collection('bank-accounts')
      .doc(id)
      .get();
  }

  getUserBankAccounts(user: User) {
    return this.angularFirestore
      .firestore
      .collection('bank-accounts')
      .where('uid', '==', user.uid)
      .get();
  }

  getBankAccountByEmail(email: string) {
    return this.angularFirestore
      .firestore
      .collection('bank-accounts')
      .where('email', '==', email)
      .get();
  }

  getBankAccountByAccountData(agency: number, accountNumber: number) {
    agency = parseInt(agency.toString().replace(/^0+/g, ''), 10);
    accountNumber = parseInt(accountNumber.toString(), 10);

    return this.angularFirestore
      .firestore
      .collection('bank-accounts')
      .where('agency', '==', agency)
      .where('number', '==', accountNumber)
      .get();
  }

  saveBankAccount(bankAccount: BankAccount) {
    bankAccount.id = this.makeBankAccountId(bankAccount);

    return this.angularFirestore
      .collection('bank-accounts')
      .doc(bankAccount.id)
      .set(bankAccount, { merge: true });
  }

  createBankAccount(user: User) {
    const bankAccount: BankAccount = {
      id: null,
      agency: this.DEFAULT_AGENCY,
      number: this.generateNewAccountNumber(),
      digit: Math.floor(Math.random() * 10),
      balance: 0.00,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
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
