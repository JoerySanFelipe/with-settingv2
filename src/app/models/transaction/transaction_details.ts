import { Timestamp } from '@angular/fire/firestore';
import { TransactionStatus } from './transaction_status';

export interface TrasactionDetails {
  updatedBy: string;
  message: string;
  status: TransactionStatus;
  updatedAt: Timestamp;
}
