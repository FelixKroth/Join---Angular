import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.class';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksCollectionRef = collection(this.firestore, 'tasks');

  constructor(private firestore: Firestore) {}

  getAllTasks(): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      getDocs(this.tasksCollectionRef)
        .then((snapshot) => {
          const tasks: Task[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              taskId: doc.id,
              taskTitle: data['taskTitle'],
              taskDescription: data['taskDescription'],
              taskDate: data['taskDate'] instanceof Timestamp ? data['taskDate'].toDate() : new Date(),
              taskPriority: data['taskPriority'],
              taskCategory: data['taskCategory'],
              taskBoardCategory: data['taskBoardCategory'],
              taskSubTask: data['taskSubTask'] || [],
              taskAssignment: data['taskAssignment'] || [],
            } as Task;
          });
          observer.next(tasks);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error fetching tasks: ', error);
          observer.error(error);
        });
    });
  }

  updateTask(taskId: string, updatedTask: Task): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);

    return updateDoc(taskDocRef, { 
      taskTitle: updatedTask.taskTitle,
      taskDescription: updatedTask.taskDescription,
      taskDate: updatedTask.taskDate,
      taskPriority: updatedTask.taskPriority,
      taskCategory: updatedTask.taskCategory,
      taskBoardCategory: updatedTask.taskBoardCategory,
      taskSubTask: updatedTask.taskSubTask,
      taskAssignment: updatedTask.taskAssignment,
    });
  }

  updateTaskCategory(taskId: string, newCategory: string): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);

    return updateDoc(taskDocRef, { taskBoardCategory: newCategory });
  }

  deleteTask(taskId: string): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);

    return deleteDoc(taskDocRef);
  }
}