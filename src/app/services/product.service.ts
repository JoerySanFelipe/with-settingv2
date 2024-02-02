import { Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';
import { Products, productConverter } from '../models/products';
import {
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  docData,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import {
  Storage,
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from '@angular/fire/storage';

import { Observable, catchError, forkJoin, switchMap } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
import { OrderItems } from '../models/transaction/order_items';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  _collection_name = 'products';
  constructor(private firestore: Firestore, private storage: Storage) {}
  getAllProducts(): Observable<Products[]> {
    return collectionData(
      collection(this.firestore, this._collection_name).withConverter(
        productConverter
      )
    ) as Observable<Products[]>;
  }
  addProduct(product: Products) {
    return setDoc(
      doc(
        collection(this.firestore, this._collection_name),
        product.id
      ).withConverter(productConverter),
      product
    );
  }

  async batchUpdateProductQuantity(orderItems: OrderItems[]) {
    const batch = writeBatch(this.firestore);

    for (const order of orderItems) {
      const productDocRef = doc(
        this.firestore,
        this._collection_name,
        order.productID
      ).withConverter(productConverter);

      try {
        const productDocSnapshot = await getDoc(productDocRef);
        if (productDocSnapshot.exists()) {
          const productData = productDocSnapshot.data();

          if (order.isVariation) {
            productData.variations.forEach((e) => {
              e.stocks -= order.quantity;
            });
          } else {
            productData.stocks -= order.quantity;
          }

          await updateDoc(productDocRef, productData);
        }
      } catch (error) {
        console.error('Error updating product: ', error);
      }
    }
    try {
      await batch.commit();
    } catch (error) {
      console.error('Error committing batch: ', error);
    }
  }

  listenToProduct(productID: string) {
    console.log(productID);
    const productDocRef = doc(
      collection(this.firestore, this._collection_name),
      productID
    ).withConverter(productConverter);
    return docData(productDocRef, { idField: productID });
  }

  updateProduct(product: Products) {
    return setDoc(
      doc(
        collection(this.firestore, this._collection_name),
        product.id
      ).withConverter(productConverter),
      product
    );
  }
  deleteProduct(id: string) {
    return deleteDoc(
      doc(collection(this.firestore, this._collection_name), id)
    );
  }
  async uploadProductImages(
    files: File[],
    productID: string
  ): Promise<string[]> {
    const downloadURLs: string[] = [];
    try {
      for (const file of files) {
        const fireRef = ref(
          this.storage,
          `${this._collection_name}/${productID}/${uuidv4()}`
        );
        await uploadBytes(fireRef, file);
        const downloadURL = await getDownloadURL(fireRef);
        downloadURLs.push(downloadURL);
      }

      return downloadURLs;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  async uploadsSingleProductImage(productID: string, file: File) {
    try {
      const fireRef = ref(
        this.storage,
        `${this._collection_name}/${productID}/${uuidv4()}`
      );
      await uploadBytes(fireRef, file);
      const downloadURL = await getDownloadURL(fireRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadVariationImage(productID: string, file: File) {
    try {
      const fireRef = ref(
        this.storage,
        `${this._collection_name}/${productID}/variation/${uuidv4()}`
      );

      await uploadBytes(fireRef, file);
      const downloadURL = await getDownloadURL(fireRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  deleteImage(path: string) {
    const fireRef = ref(this.storage, path);
    return deleteObject(fireRef);
  }

  deleteProductByID(productID: string) {
    const folder = ref(this.storage, `${this._collection_name}/${productID}`);
    const storageDelete = listAll(folder).then((data) => {
      data.items.forEach((element) => {
        deleteObject(element);
      });
    });
    const firestoreDelete = deleteDoc(
      doc(collection(this.firestore, this._collection_name), productID)
    );
    return forkJoin([storageDelete, firestoreDelete]);
  }
}
