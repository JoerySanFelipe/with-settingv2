import { Timestamp, Transaction } from '@angular/fire/firestore';
import { UserType } from '../user-type';
import { ActionType, ComponentType } from './audit_type';

export interface Audit {
  id: string;
  email: string;
  role: UserType;
  action: ActionType;
  component: ComponentType;
  payload: any;
  details: string;
  timestamp: Timestamp;
}
