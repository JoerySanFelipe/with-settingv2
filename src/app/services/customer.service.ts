import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';

import { customerConverter } from '../models/customers';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customer_table = 'customers';
  constructor(private firestore: Firestore) {}

  getCustomerInfo(customerID: string) {
    return getDoc(
      doc(
        collection(this.firestore, this.customer_table),
        customerID
      ).withConverter(customerConverter)
    );
  }
}
