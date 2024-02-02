import { Injectable } from '@angular/core';

import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';

import { v4 as uuidv4 } from 'uuid';
import { PestMap, Topic } from '../models/pest';

import {
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
@Injectable({
  providedIn: 'root',
})
export class PestService {
  _collection_name = 'pest_map';
  constructor(private firestore: Firestore, private storage: Storage) {}
  async uploadPestImage(file: File) {
    try {
      const fireRef = ref(this.storage, `${this._collection_name}/${uuidv4()}`);
      await uploadBytes(fireRef, file);
      const downloadURL = await getDownloadURL(fireRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  addPestmap(pest: PestMap) {
    pest.id = uuidv4();
    return setDoc(
      doc(collection(this.firestore, this._collection_name), pest.id),
      pest
    );
  }
  getAllPestMap(): Observable<PestMap[]> {
    return collectionData(
      collection(this.firestore, this._collection_name)
    ) as Observable<PestMap[]>;
  }

  addPestMapTopic(pestID: string, topic: Topic) {
    return updateDoc(doc(this.firestore, this._collection_name, pestID), {
      topic: arrayUnion(topic),
    });
  }
}
