import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import DocumentData = firebase.firestore.DocumentData;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { User } from 'src/app/models/user.model';
import { Filter } from 'src/app/models/filter.model';

// noinspection JSMethodCanBeStatic
@Injectable({
  providedIn: 'root'
})
export class CcService {

  constructor(private angularFirestore: AngularFirestore) { }

  getCreditCard(cId: string) {
    return this.angularFirestore
      .firestore
      .collection('credit-cards').doc(cId).get();
  }

  getUserCreditCards(user: User, filters: Array<Filter> = []) {
    const transactionsQuery = this.angularFirestore
      .firestore
      .collection('credit-cards')
      .where('uid', '==', user.uid);

    filters.forEach(filter => transactionsQuery.where(filter.fieldPath, filter.opStr, filter.value));

    return transactionsQuery.get();
  }
}
