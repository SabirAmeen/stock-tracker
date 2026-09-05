import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firebaseApp } from '../firebase/firebase.app';
import { StockSignal } from '../models/stock-signal.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private db = getFirestore(firebaseApp);

  getSwingTrades(): Observable<StockSignal[]> {
    return new Observable<StockSignal[]>((subscriber) => {
      const col = collection(this.db, 'swing_trades');
      const q = query(col, orderBy('setupScore', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const trades = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...(doc.data() as Omit<StockSignal, 'id'>),
          }));
          subscriber.next(trades);
        },
        (error) => subscriber.error(error)
      );

      // Cleanup: unsubscribe from Firestore listener when Observable is torn down
      return () => unsubscribe();
    });
  }
}
