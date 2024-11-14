import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.class'; // Adjust the path as necessary
import { TaskService } from '../services/task.service'; // Adjust the path as necessary
import { Observable } from 'rxjs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    MatIconModule, 
    MatButtonModule, 
    CommonModule
  ],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'] // Create or update this CSS file for styles
})
export class SummaryComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error loading tasks', error);
      }
    );
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  getTasksByCategory(category: string): Task[] {
    return this.tasks.filter(task => task.taskBoardCategory === category); // Use taskBoardCategory
  }

  getHighPriorityTasks(): Task[] {
    return this.tasks.filter(task => task.taskPriority === 'High');
  }

  getNearestDueDateForHighPriority(): Date | null {
    const highPriorityTasks = this.getHighPriorityTasks();
    if (highPriorityTasks.length === 0) return null;

    return highPriorityTasks
      .map(task => new Date(task.taskDate))
      .reduce((prev, curr) => (curr < prev ? curr : prev));
  }
}
