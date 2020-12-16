import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { BankAccount } from 'src/app/models/bank.account.model';
import { Transaction, TransactionTypeEnum, TransactionCategoryEnum } from 'src/app/models/transaction.model';
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
    const bankAccountRef = this.angularFirestore.firestore.collection('bank-accounts').doc(bankAccount.id);
    const transactionRef = this.angularFirestore.firestore.collection('transactions').doc();

    return this.angularFirestore.firestore.runTransaction((dbTransaction) => {
      return dbTransaction.get(bankAccountRef).then((bankAccountRes: DocumentSnapshot<BankAccount>) => {
        if (!bankAccountRes.exists) {
          throw new Error('A conta especificada não existe');
        }

        const transactionData: Transaction = {
          uid: bankAccountRes.data().id,
          bankAccountId: bankAccount.id,
          type,
          category,
          amount,
          description: description || '',
          metadata: metadata || {},
          creationDate: firebase.firestore.Timestamp.now()
        };

        let balance = bankAccountRes.data().balance;

        if (type === TransactionTypeEnum.CREDIT) {
          balance += amount;
        }

        if (type === TransactionTypeEnum.DEBIT) {
          balance -= amount;
        }

        if (balance !== bankAccountRes.data().balance) {
          dbTransaction.update(bankAccountRef, { balance });
        }

        dbTransaction.set(transactionRef, transactionData);
      });
    });
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
