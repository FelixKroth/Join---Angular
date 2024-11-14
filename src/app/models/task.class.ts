export class Task {
  taskId: string;
  taskTitle: string;
  taskDescription?: string; // Optional
  taskDate: Date;
  taskPriority?: string; // Optional
  taskCategory?: string; // Optional
  taskBoardCategory: string;
  taskSubTask: { name: string; done: boolean }[]; // Initialize as an empty array in the constructor
  taskAssignment: { firstName: string; lastName: string; eMail: string }[];

  constructor() {
    this.taskId = '';
    this.taskTitle = '';
    this.taskDescription = ''; // Default to an empty string
    this.taskDate = new Date(); // Default to current date
    this.taskPriority = ''; // Default to an empty string
    this.taskCategory = ''; // Default to an empty string
    this.taskBoardCategory = 'To do'; // Default board category
    this.taskSubTask = []; // Initialize subtasks to an empty array
    this.taskAssignment = []; // Initialize assignments to an empty array
  }
}