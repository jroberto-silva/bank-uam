import firebase from 'firebase/app';

export interface Cc {
  uid: string;
  ccNumber: string;
  ccBrand: string;
  ccCvv: number;
  ccMonth: number;
  ccYear: number;
  isVirtual: boolean;
  creationDate: firebase.firestore.Timestamp;
}
