import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.class';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private firestore: Firestore) {}

  getAllContacts(): Observable<Contact[]> {
    const contactsCollection = collection(this.firestore, 'contacts');
    return collectionData(contactsCollection, { idField: 'id' }) as Observable<Contact[]>;
  }
}