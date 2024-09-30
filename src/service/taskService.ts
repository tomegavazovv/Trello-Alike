import { deleteTask, saveTask, updateTask, updateTaskColumn, updateTasksOrder } from "../db/db"
import { TaskInput, Column, Task, TaskColumns } from "../models/Task";
import { recalculateOrder } from "../utils/taskUtils";
import { getTasks as getTasksFromDb } from "../db/db";
import { auth } from "../firebaseConfig";

export function addTask(taskText: string, column: Column, order: number): Task {
    const task: TaskInput = {
        text: taskText,
        column: column,
        order,
    };
    return saveTask(task);
}

export function deleteTaskFromColumn(taskId: string): Promise<void> {
    return deleteTask(taskId);
}

export function updateTaskText(task: Task): Promise<Task> {
    return updateTask(task);
}

export function reorderTasks(tasks: Task[], droppedTaskId: string, targetTaskId: string): Task[] {
    const taskIndex = tasks.findIndex(task => task.id === droppedTaskId);
    const targetIndex = targetTaskId
        ? tasks.findIndex(task => task.id === targetTaskId)
        : tasks.length;

    const [movedTask] = tasks.splice(taskIndex, 1);
    tasks.splice(targetIndex, 0, movedTask);

    const updatedTasks = recalculateOrder(tasks);
    updateTasksOrder(updatedTasks);
    return updatedTasks;
}

export function moveTaskToColumn(taskId: string, newColumn: Column, order: number): Promise<Task> {
    return updateTaskColumn(taskId, newColumn, order);
}

export function getTasks(): Promise<TaskColumns> {
    return getTasksFromDb(auth.currentUser.uid);
}