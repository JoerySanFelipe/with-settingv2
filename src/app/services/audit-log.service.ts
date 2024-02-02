import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

import { Audit } from '../models/audit/audit';
import { generateInvoiceID } from '../utils/constants';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
const AUDIT_TABLE = 'audit';
@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private processedDocumentIds = new Set<string>();

  constructor(private firestore: Firestore) {}

  async saveAudit(audit: Audit) {
    audit.id = generateInvoiceID();
    await setDoc(
      doc(collection(this.firestore, AUDIT_TABLE), audit.id),
      audit
    ).catch((err) => console.log(err.message));
  }

  getAllAudits(): Observable<Audit[]> {
    const q = query(
      collection(this.firestore, AUDIT_TABLE),
      orderBy('timestamp', 'desc')
    );
    return collectionData(q) as Observable<Audit[]>;
  }
}
