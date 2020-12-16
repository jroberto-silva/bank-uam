import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { BankAccount } from 'src/app/models/bank.account.model';
import { Transaction, TransactionTypeEnum, TransactionCategoryEnum } from 'src/app/models/transaction.model';
import { User } from 'src/app/models/user.model';
import { Filter } from 'src/app/models/filter.model';

// noinspection JSMethodCanBeStatic
@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  getTransaction(tid: string) {
    return this.angularFirestore
      .firestore
      .collection('transactions').doc(tid).get();
  }

  getBankAccountTransactions(bankAccount: BankAccount, filters: Array<Filter> = []) {
    const transactionsQuery = this.angularFirestore
      .firestore
      .collection('transactions')
      .where('bankAccountId', '==', bankAccount.id);

    filters.forEach(filter => transactionsQuery.where(filter.fieldPath, filter.opStr, filter.value));

    return transactionsQuery.orderBy('creationDate', 'desc').get();
  }

  createTransaction(bankAccount: BankAccount, type: number, category: number, amount: number, description?: string, metadata?: any) {
    const transaction: Transaction = {
      uid: bankAccount.uid,
      bankAccountId: bankAccount.id,
      type,
      category,
      amount,
      description,
      metadata,
      creationDate: firebase.firestore.Timestamp.now()
    };

    this.angularFirestore
      .collection('transactions')
      .add(transaction);
  }

  public categoryDisplay(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    const transactionData = transaction.data();

    if (transactionData.category === TransactionCategoryEnum.PAYMENT) {
      return 'Pagamento efetuado';
    }

    if (transactionData.category === TransactionCategoryEnum.TRANSFER) {
      return transactionData.type === TransactionTypeEnum.DEBIT ? 'Transferência enviada' : 'Transferência recebida';
    }

    if (transactionData.category === TransactionCategoryEnum.SAVINGS) {
      return transactionData.type === TransactionTypeEnum.CREDIT ? 'Dinheiro resgatado' : 'Dinheiro guardado';
    }

    return 'Transação efetuada';
  }

  public creationDateShortDisplay(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    const transactionData = transaction.data();
    const transactionCreationDate = transactionData.creationDate.toDate();

    return months[transactionCreationDate.getMonth()] + '/' + transactionCreationDate.getFullYear();
  }

  public creationDateLocaleDisplay(transaction: DocumentSnapshot<Transaction | DocumentData>) {
    return transaction.data().creationDate.toDate().toLocaleString();
  }
}
