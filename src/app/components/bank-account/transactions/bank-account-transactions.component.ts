/* tslint:disable:no-inferrable-types */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/app';
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { TransactionService } from 'src/app/services/transaction.service';
import { BankAccount } from 'src/app/models/bank.account.model';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-bank-account-transactions',
  templateUrl: './bank-account-transactions.component.html',
  styleUrls: ['./bank-account-transactions.component.scss'],
})
export class BankAccountTransactionsComponent implements OnInit {

  @Input() public bankAccount: BehaviorSubject<BankAccount>;
  @Input() public loadingBankAccount: boolean;

  public loading: boolean;
  public transactions: Array<DocumentSnapshot<Transaction | DocumentData>>;

  constructor(private router: Router, private transactionService: TransactionService) {
  }

  ngOnInit() {
    this.bankAccount.subscribe(bankAccount => this.loadTransactions(bankAccount));
  }

  loadTransactions(bankAccount: BankAccount) {
    if (!bankAccount) {
      return;
    }

    this.updateLoading(true);

    this.transactionService.getBankAccountTransactions(bankAccount)
      .then((querySnapshot) => {
        this.transactions = querySnapshot.docs;
      })
      .finally(() => this.updateLoading(false));
  }

  public updateLoading(loading: boolean) {
    this.loading = loading;
  }

  public openTransaction(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    this.router.navigate(['/bank-account/transaction', transaction.id]);
  }

  public categoryDisplay(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    return this.transactionService.categoryDisplay(transaction);
  }

  public creationDateDisplay(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    return this.transactionService.creationDateShortDisplay(transaction);
  }

  public descriptionDisplay(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    const transactionData = transaction.data();

    return transactionData.description ? transactionData.description : '';
  }
}
