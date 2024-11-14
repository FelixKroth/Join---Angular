import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { TaskService } from './../services/task.service';
import { Task } from '../models/task.class';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  allTasks: Task[] = [];

  constructor(public dialog: MatDialog, private firestore: Firestore) {}

  ngOnInit(): void {
    const tasksCollection = collection(this.firestore, 'tasks');
    collectionData(tasksCollection, { idField: 'id' }).subscribe((tasks: any) => {
      // Convert Firestore Timestamp to Date
      this.allTasks = tasks.map((task: any) => ({
        ...task,
        taskDate: task.taskDate instanceof Timestamp ? task.taskDate.toDate() : task.taskDate, // Convert if Timestamp
      })) as Task[]; // Cast to Task[]
      console.log('All tasks:', this.allTasks);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddTaskComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      // Refresh tasks after adding a new one if needed
      this.ngOnInit();
    });
  }
}
