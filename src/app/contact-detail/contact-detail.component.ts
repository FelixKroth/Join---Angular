import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, collectionData, doc, docData, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Contact } from '../models/contact.class';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditContactDetailsComponent } from '../dialog-edit-contact-details/dialog-edit-contact-details.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    CommonModule
  ],
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
})
export class ContactDetailComponent implements OnInit {
  contactId: string | null = '';
  contact: Contact = new Contact();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.contactId = paramMap.get('id');
      console.log('Got ID', this.contactId);

      if (this.contactId) {
        this.getContact(this.contactId);
      }
    });
  }

  getContact(contactId: string) {
    const contactDocRef = doc(this.firestore, `contacts/${contactId}`);
    docData(contactDocRef).subscribe((contactData: any) => {
      this.contact = contactData as Contact;
      console.log('Contact data:', this.contact);
    });
  }

  deleteContact() {
    const contactDocRef = doc(this.firestore, `contacts/${this.contactId}`);
    deleteDoc(contactDocRef).then(() => {
      console.log('Contact deleted successfully');
      this.router.navigate(['/']); // Navigate back to contact list
    }).catch((error) => {
      console.error('Error deleting contact: ', error);
    });
  }

  openDialogEditAddress() {
    const dialogRef = this.dialog.open(DialogEditAddressComponent);
    
    dialogRef.componentInstance.contact = JSON.parse(JSON.stringify(this.contact));
  
    dialogRef.afterClosed().subscribe((updatedContact) => {
      if (updatedContact) {
        this.updateContact(updatedContact);
      }
    });
  }
  
  openDialogEditContactDetails() {
    const dialogRef = this.dialog.open(DialogEditContactDetailsComponent);
  
    dialogRef.componentInstance.contact = JSON.parse(JSON.stringify(this.contact));
  
    dialogRef.afterClosed().subscribe((updatedContact) => {
      if (updatedContact) {
        this.updateContact(updatedContact);
      }
    });
  }
  
  updateContact(updatedContact: Contact) {
    const contactDocRef = doc(this.firestore, `contacts/${this.contactId}`);
    setDoc(contactDocRef, updatedContact).then(() => {
      console.log('Contact updated successfully');
    }).catch((error) => {
      console.error('Error updating contact: ', error);
    });
  }
}
