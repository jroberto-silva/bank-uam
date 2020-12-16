import firebase from 'firebase/app';

export enum TransactionTypeEnum {
  CREDIT = 0,
  DEBIT = 1,
  NEUTRAL = 2
}

export enum TransactionCategoryEnum {
  TRANSFER = 0,
  PAYMENT = 1,
  SAVINGS = 2
}

export interface Transaction {
  uid: string;
  bankAccountId: string;
  type: number;
  category: number;
  description: string;
  amount: number;
  metadata?: {
    // Transfer related fields
    counterpartBank?: string,
    counterpartName?: string,
    counterpartAgency?: string,
    counterpartAccountNumber?: string,
    counterpartAccountDigit?: string,

    // payment related fields
    documentCode?: string;
    dueDate?: firebase.firestore.Timestamp,
    recipient?: string
  };
  creationDate: firebase.firestore.Timestamp;
}
