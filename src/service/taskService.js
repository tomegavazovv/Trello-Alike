import { deleteTask, saveTask, updateTask, updateTaskColumn, updateTasksOrder } from "../db/db.js"
import { recalculateOrder } from "../utils/taskUtils.js";
import store from "../store/store.js";

export async function addTask(taskText, column, order) {
    const task = {
        text: taskText,
        column,
        order
    };

    const addedTask = await saveTask(task);
    return addedTask;
}

export function deleteTaskFromColumn(taskId) {
    deleteTask(taskId);
}

export function updateTaskText(task) {
    updateTask(task);
}

export function reorderTasks(tasks, droppedTaskId, targetTaskId) {
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

export function moveTaskToColumn(taskId, newColumn, order) {
    updateTaskColumn(taskId, newColumn, order);
}

export function moveTaskToColumnEnd(taskId, column) {
    const task = store.getTaskOfColumn(taskId, column);
    task.order = Math.max(...store.getTasksOfColumn(column).map(t => t.order)) + 1;

    updateTask(task);
}
