import { FieldPath } from '@angular/fire/firestore';
import firebase from 'firebase';

export interface Filter {
  fieldPath: string | FieldPath;
  opStr: firebase.firestore.WhereFilterOp;
  value: any;
}
