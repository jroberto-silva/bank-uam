import firebase from 'firebase/app';

export interface BankAccount {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  agency: number;
  number: number;
  digit: number;
  balance: number;
  creationDate: firebase.firestore.Timestamp | null;
}
