import { deleteTask, saveTask, updateTask, updateTaskColumn, updateTasksOrder } from "../db/db.js"
import { recalculateOrder } from "../utils/taskUtils.js";

export async function addTask(taskText, column, order, userId) {
    const task = {
        text: taskText,
        column,
        order,
    };

    const addedTask = await saveTask(task, userId);
    return addedTask;
}

export function deleteTaskFromColumn(taskId, userId) {
    deleteTask(taskId, userId);
}

export function updateTaskText(task, userId) {
    updateTask(task, userId);
}

export function reorderTasks(tasks, droppedTaskId, targetTaskId, userId) {
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

export function moveTaskToColumn(taskId, newColumn, order, userId) {
    updateTaskColumn(taskId, newColumn, order, userId);
}

