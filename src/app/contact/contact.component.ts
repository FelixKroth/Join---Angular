import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from './../models/contact.class';
import { MatCardModule } from '@angular/material/card';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DialogAddContactComponent } from '../dialog-add-contact/dialog-add-contact.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contact = new Contact();
  allContacts: Contact[] = [];

  constructor(public dialog: MatDialog, private firestore: Firestore, private router: Router) {}

  navigateToDetail(contactId: string) {
    this.router.navigate(['/contact', contactId]);
  }

  ngOnInit(): void {
    const contactsCollection = collection(this.firestore, 'contacts');

    collectionData(contactsCollection, { idField: 'id' }).subscribe((contacts: any) => {
      this.allContacts = contacts as Contact[]; 
      console.log('All contacts:', this.allContacts);
    });
  }

  openDialog() {
    this.dialog.open(DialogAddContactComponent);
  }

  deleteContact(contactId: string) {
    const contactDocRef = doc(this.firestore, `contacts/${contactId}`);
    deleteDoc(contactDocRef).then(() => {
      console.log('Contact deleted successfully');
    }).catch((error) => {
      console.error('Error deleting contact: ', error);
    });
  }
}
