import firebase from 'firebase/app';

export enum TransactionTypeEnum {
  CREDIT = 0,
  DEBIT = 1,
  NEUTRAL = 2
}

export enum TransactionCategoryEnum {
  TRANSFER = 0,
  PAYMENT = 1,
  SAVINGS = 2,
  REFUND = 3
}

export interface Transaction {
  uid: string;
  bankAccountId: string;
  type: number;
  category: number;
  description: string;
  amount: number;
  metadata?: {
    counterpartBank?: string,
    counterpartName?: string,
    counterpartAgency?: string,
    counterpartAccountNumber?: string,
    counterpartAccountDigit?: string
  };
  creationDate: firebase.firestore.Timestamp;
}
