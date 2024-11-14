import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Contact } from '../models/contact.class';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-contact-details',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dialog-edit-contact-details.component.html',
  styleUrls: ['./dialog-edit-contact-details.component.scss'],
})
export class DialogEditContactDetailsComponent {
  contact: Contact;
  loading = false;

  constructor(public dialogRef: MatDialogRef<DialogEditContactDetailsComponent>) {}

  saveContact() {
    this.dialogRef.close(this.contact);
  }
}