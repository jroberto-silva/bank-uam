import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { BankAccount } from 'src/app/models/bank.account.model';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { Transaction, TransactionCategoryEnum, TransactionTypeEnum } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

  public loading: boolean;
  public bankAccount: BankAccount;
  public bankAccountDocument: DocumentSnapshot<DocumentData | BankAccount>;
  public transaction: Transaction;
  public transactionDocument: DocumentSnapshot<DocumentData>;
  public error: string;
  public user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private bankAccountService: BankAccountService
  ) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.loading = true;

    const tid = this.route.snapshot.paramMap.get('tid');

    this.transactionService.getTransaction(tid)
      .then((document: DocumentSnapshot<DocumentData>) => {
        if (!document.exists) {
          throw new Error('Transação não encontrada.');
        }

        this.transaction = document.data() as Transaction;
        this.transactionDocument = document;
      })
      .then(() => this.bankAccountService.getBankAccount(this.transaction.bankAccountId))
      .then((bankAccountDoc) => {
        if (!bankAccountDoc.exists) {
          throw new Error('Não foi possível carregar os dados de sua conta no momento.');
        }

        this.bankAccount = bankAccountDoc.data() as BankAccount;
        this.bankAccountDocument = bankAccountDoc;
      })
      .catch(error => {
        this.error = error;
      })
      .finally(() => this.loading = false);
  }

  public getTransferAccountInfo(part: 'ORIGIN' | 'DESTINATION') {
    const currentUserData = () => ({
      name: this.user.displayName,
      bank: 'UAM Bank',
      agency: this.bankAccount.agency.toString().padStart(4, '0'),
      account: this.bankAccount.number + '-' + this.bankAccount.digit
    });

    const counterPartData = () => ({
      name: this.transaction.metadata.counterpartName || '-',
      bank: this.transaction.metadata.counterpartBank || 'UAM Bank',
      agency: this.transaction.metadata.counterpartAgency || '-',
      account: this.transaction.metadata.counterpartAccountNumber + '-' + this.transaction.metadata.counterpartAccountDigit
    });

    if (this.transaction.type === TransactionTypeEnum.DEBIT) {
      return part === 'ORIGIN' ? currentUserData() : counterPartData();
    }

    return part === 'ORIGIN' ? counterPartData() : currentUserData();
  }

  public get isTransfer() {
    return this.transaction.category === TransactionCategoryEnum.TRANSFER;
  }

  public get isSavings() {
    return this.transaction.category === TransactionCategoryEnum.SAVINGS;
  }

  public get isPayment() {
    return this.transaction.category === TransactionCategoryEnum.PAYMENT;
  }

  public get isCredit() {
    return this.transaction.type === TransactionTypeEnum.CREDIT;
  }

  public get dueDate() {
    return this.transaction.metadata.dueDate ? this.transaction.metadata.dueDate.toDate().toLocaleDateString() : '-';
  }

  public get documentCode() {
    return this.transaction.metadata.documentCode ? this.transaction.metadata.documentCode.replace(/[^0-9]/g, '') : '-';
  }

  public get category() {
    return this.transactionService.categoryDisplay(this.transactionDocument);
  }

  public get creationDate() {
    return this.transactionService.creationDateLocaleDisplay(this.transactionDocument);
  }
}
