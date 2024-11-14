import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Contact } from './../models/contact.class';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-contact',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dialog-add-contact.component.html',
  styleUrls: ['./dialog-add-contact.component.scss'],
})

export class DialogAddContactComponent {
  contact = new Contact();
  birthDate: Date;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  constructor(public dialogRef: MatDialogRef<DialogAddContactComponent>, private firestore: Firestore) {}

  // Generate a random color
  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  saveContact() {
    if (!this.contact.firstName || !this.contact.lastName || !this.contact.eMail) {
      return;
    }

    if (this.birthDate) {
      this.contact.birthDate = this.birthDate.getTime();
    }

    // Assign a random color to the contact
    this.contact.color = this.generateRandomColor();

    const contactsCollection = collection(this.firestore, 'contacts');
    addDoc(contactsCollection, {
      firstName: this.contact.firstName,
      lastName: this.contact.lastName,
      eMail: this.contact.eMail,
      birthDate: this.contact.birthDate,
      street: this.contact.street,
      zipCode: this.contact.zipCode,
      city: this.contact.city,
      color: this.contact.color  // Save the color to Firestore
    }).then((result) => {
      console.log('Contact successfully added to Firestore', result);
      this.dialogRef.close();
    }).catch((error) => {
      console.error('Error adding contact to Firestore: ', error);
    });
  }
}
