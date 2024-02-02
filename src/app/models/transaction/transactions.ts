import {
  QueryDocumentSnapshot,
  Timestamp,
  Transaction,
} from '@angular/fire/firestore';
import { OrderItems } from './order_items';
import { Payment } from './payment';
import { ShippingFee } from './shipping_fee';
import { TrasactionDetails } from './transaction_details';
import { TransactionSchedule } from './transaction_schedule';
import { TransactionStatus } from './transaction_status';
import { TransactionType } from './transaction_type';
import { Address } from '../user_address';

export interface Transactions {
  id: string;
  cashierID: string;
  customerID: string;
  type: TransactionType;
  orderList: OrderItems[];
  message: string;
  status: TransactionStatus;
  payment: Payment;
  details: TrasactionDetails[];
  shippingFee?: ShippingFee;
  address?: Address;
  createdAt: Timestamp;
  schedule?: TransactionSchedule;
}
export const transactionConverter = {
  toFirestore: (data: Transaction) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Transaction,
};
