import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { ContactService } from '../services/contact.service';
import { Task } from '../models/task.class';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  allTasks: Task[] = [];
  allContacts: any[] = [];
  taskDetailsVisible: boolean = false;
  selectedTask: Task | null = null;
  draggedTaskId: string | null = null;
  editingTask: boolean = false;
  isTouchDevice: boolean = false;

  taskCategoryOptions: string[] = ['Technical Task', 'User Story'];
  assignedContactIds: string[] = []; // To hold the selected contacts' emails
  taskDateString: string = ''; // For the date input

  constructor(
    private taskService: TaskService,
    private contactService: ContactService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadContacts();
    this.checkIfTouchDevice();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.allTasks = tasks;
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
      },
    });
  }

  loadContacts(): void {
    this.contactService.getAllContacts().subscribe((contacts: any[]) => {
      this.allContacts = contacts;
    });
  }

  checkIfTouchDevice(): void {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  getTasksByCategory(category: string): Task[] {
    return this.allTasks.filter(
      (task) => task.taskBoardCategory.toLowerCase() === category.toLowerCase()
    );
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, newCategory: string): void {
    event.preventDefault();
    if (this.draggedTaskId) {
      this.taskService
        .updateTaskCategory(this.draggedTaskId, newCategory)
        .then(() => this.loadTasks())
        .catch((error: any) => console.error(error));
      this.draggedTaskId = null;
    }
  }

  onDragStart(event: DragEvent, taskId: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('taskId', taskId);
    }
    this.draggedTaskId = taskId;
  }

  closeTaskDetails(): void {
    this.taskDetailsVisible = false;
    this.selectedTask = null;
    this.editingTask = false;
    this.assignedContactIds = []; // Reset the selected contact IDs
  }

  showTaskDetails(task: Task): void {
    this.selectedTask = { ...task };
    this.assignedContactIds = task.taskAssignment.map(contact => contact.eMail); // Prepopulate assigned contacts
    this.taskDateString = this.formatDateForInput(this.selectedTask.taskDate);
    this.taskDetailsVisible = true;
    this.editingTask = false;
  }

  editTask(): void {
    if (this.selectedTask) {
      this.editingTask = true;
      this.taskDetailsVisible = false;
    }
  }

  cancelEditTask(): void {
    this.editingTask = false;
    this.taskDetailsVisible = true;
  }

  saveTaskChanges(): void {
    if (this.selectedTask) {
      this.selectedTask.taskDate = new Date(this.taskDateString);
      this.selectedTask.taskAssignment = this.assignedContactIds.map(
        (id) => this.allContacts.find((contact) => contact.eMail === id)
      );

      this.taskService
        .updateTask(this.selectedTask.taskId, this.selectedTask)
        .then(() => {
          this.loadTasks();
          this.closeTaskDetails();
        })
        .catch((error: any) => {
          console.error('Error updating task:', error);
        });
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleContactSelection(contactEmail: string): void {
    const index = this.assignedContactIds.indexOf(contactEmail);
    if (index === -1) {
      this.assignedContactIds.push(contactEmail); // Select if not already selected
    } else {
      this.assignedContactIds.splice(index, 1); // Deselect if already selected
    }
  }

  isContactAssigned(contactEmail: string): boolean {
    return this.assignedContactIds.includes(contactEmail); // Check if contact is assigned
  }

  // Utility function to extract initials
  getInitials(firstName: string, lastName: string): string {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
}
