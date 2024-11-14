import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Task } from './../models/task.class';
import { Contact } from './../models/contact.class';
import { ContactService } from './../services/contact.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dialog-add-task',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dialog-add-task.component.html',
  styleUrls: ['./dialog-add-task.component.scss'],
})
export class DialogAddTaskComponent {
  task: Task = new Task();
  priorityText: string = '';
  minDate: string = '';
  allContacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  subTaskName: string = '';

  priorityOptions: string[] = ['Low', 'Medium', 'High'];
  taskCategoryOptions: string[] = ['Technical Task', 'User Story'];

  constructor(
    public dialogRef: MatDialogRef<DialogAddTaskComponent>,
    private firestore: Firestore,
    private contactService: ContactService
  ) {
    this.setMinDateDatepicker();
    this.loadContacts();
  }

  saveTask() {
    if (!this.task.taskTitle) {
      console.error('Task title is required');
      return;
    }

    this.task.taskId = uuidv4();

    this.task.taskBoardCategory = 'To do';

    const tasksCollection = collection(this.firestore, 'tasks');
    this.task.taskAssignment = this.selectedContacts.map(contact => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      eMail: contact.eMail,
    }));

    addDoc(tasksCollection, {
      ...this.task,
      taskSubTask: this.task.taskSubTask,
      taskAssignment: this.task.taskAssignment
    })
      .then(() => {
        console.log('Task successfully added to Firestore');
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error('Error adding task to Firestore: ', error);
      });
  }

  setMinDateDatepicker(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  addSubTask(): void {
    if (this.subTaskName.trim()) {
      this.task.taskSubTask.push({ name: this.subTaskName, done: false });
      this.subTaskName = '';
    } else {
      console.error('SubTask name is empty');
    }
  }

  loadContacts() {
    this.contactService.getAllContacts().subscribe((contacts: Contact[]) => {
      this.allContacts = contacts;
    });
  }

  toggleContact(contact: Contact) {
    const index = this.selectedContacts.findIndex(c => c.eMail === contact.eMail);
    if (index >= 0) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contact);
    }
  }

  isContactSelected(contact: Contact): boolean {
    return this.selectedContacts.some(c => c.eMail === contact.eMail);
  }

  removeSubTask(index: number): void {
    this.task.taskSubTask.splice(index, 1);
  }

  setPriorityText(priority: string): void {
    this.priorityText = priority;
    this.task.taskPriority = priority;
  }

  setTaskCategory(category: string): void {
    this.task.taskCategory = category;
  }
}
