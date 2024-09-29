import { deleteTask, saveTask, updateTask, updateTaskColumn, updateTasksOrder } from "../db/db"
import { TaskInput, Column, Task, TaskColumns } from "../models/Task";
import { recalculateOrder } from "../utils/taskUtils";
import { getTasks as getTasksFromDb } from "../db/db";

export async function addTask(taskText: string, column: Column, order: number, userId: string) {

    const task: TaskInput = {
        text: taskText,
        column: column,
        order,
    };

    const addedTask = await saveTask(task, userId);
    return addedTask;
}

export function deleteTaskFromColumn(taskId: string, userId: string) {
    deleteTask(taskId, userId);
}

export function updateTaskText(task: Task, userId: string) {
    updateTask(task, userId);
}

export function reorderTasks(tasks: Task[], droppedTaskId: string, targetTaskId: string, userId: string) {
    const taskIndex = tasks.findIndex(task => task.id === droppedTaskId);
    const targetIndex = targetTaskId
        ? tasks.findIndex(task => task.id === targetTaskId)
        : tasks.length;

    const [movedTask] = tasks.splice(taskIndex, 1);
    tasks.splice(targetIndex, 0, movedTask);

    const updatedTasks = recalculateOrder(tasks);
    updateTasksOrder(updatedTasks, userId);
    return updatedTasks;
}

export function moveTaskToColumn(taskId: string, newColumn: Column, order: number, userId: string) {
    updateTaskColumn(taskId, newColumn, order, userId);
}

export function getTasks(userId: string): Promise<TaskColumns> {
    return getTasksFromDb(userId);
}