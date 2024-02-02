import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Customers {
  id: string;
  name: string;
  phone: string;
  profile: string;
  createdAt: Date;
  address: [];
}
export const customerConverter = {
  toFirestore: (data: Customers) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Customers,
};
