import { deleteTask, saveTask, updateTask, updateTaskColumn, updateTasksOrder } from "../db/db"
import { TaskInput, Column, Task, TaskColumns } from "../models/Task";
import { recalculateOrder } from "../utils/taskUtils";
import { getTasks as getTasksFromDb } from "../db/db";
import { auth } from "../firebaseConfig";
import { generateTaskId as generateTaskIdFromFirebase } from "../db/db";

export async function addTask(task: TaskInput): Promise<Task> {
    return await saveTask(task);
}

export function generateTaskId(): string {
    return generateTaskIdFromFirebase();
}

export function deleteTaskFromColumn(taskId: string): Promise<void> {
    return deleteTask(taskId);
}

export function updateTaskText(task: Task): Promise<void> {
    return updateTask(task);
}

export function reorderTasks(tasks: Task[], droppedTaskId: string, targetTaskId: string): Task[] {
    const droppedTaskIndex = tasks.findIndex(task => task.id === droppedTaskId);
    const targetTaskIndex = tasks.findIndex(task => task.id === targetTaskId);

    const [droppedTask] = tasks.splice(droppedTaskIndex, 1);
    tasks.splice(targetTaskIndex, 0, droppedTask);
    const updatedTasks = recalculateOrder(tasks);
    return updatedTasks;
}

export async function updateTasksOrderOnServer(updatedTasks: Task[]): Promise<Task[]> {
    await updateTasksOrder(updatedTasks);
    return updatedTasks;
}

export function moveTaskToColumn(taskId: string, newColumn: Column, order: number): Promise<Task> {
    return updateTaskColumn(taskId, newColumn, order);
}

export function getTasks(): Promise<TaskColumns> {
    return getTasksFromDb(auth.currentUser.uid);
}