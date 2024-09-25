import { deleteTask, saveTask, updateTask, updateTaskOrder, updateTasksOrder } from "../db";
import state from "../../state";
import { recalculateOrder } from "./taskUtils";

export async function addTask(taskText, column) {
    const columnTasks = state.tasks[column];
    const maxOrder = columnTasks.length > 0
        ? Math.max(...columnTasks.map(t => t.order))
        : 0;

    const task = {
        text: taskText,
        column,
        order: maxOrder + 1,
    };

    const addedTask = await saveTask(task);
    state.addTask(addedTask);
    return addedTask;
}

export function deleteTaskFromColumn(taskId, column) {
    const task = state.getTaskOfColumn(taskId, column);
    state.deleteTask(task);
    deleteTask(task);
}

export function updateTaskText(taskId, newText, column) {
    const task = state.getTaskOfColumn(taskId, column);
    const newTask = {
        ...task,
        text: newText,
        updatedAt: new Date(),
    };

    state.updateTask(newTask);
    updateTask(newTask);
}

export function moveTaskAfter(taskId, targetTaskId, column) {
    const columnTasks = state.getTasksOfColumn(column);
    const taskIndex = columnTasks.findIndex(task => task.id === taskId);
    const targetIndex = targetTaskId
        ? columnTasks.findIndex(task => task.id === targetTaskId)
        : columnTasks.length - 1;

    const [movedTask] = columnTasks.splice(taskIndex, 1);
    columnTasks.splice(targetIndex, 0, movedTask);

    const updatedTasks = recalculateOrder(columnTasks);

    state.updateTasksOrder(updatedTasks, column);
    updateTasksOrder(updatedTasks);
}

export function moveTaskToColumn(taskId, fromColumn, toColumn) {
    const task = state.getTaskOfColumn(taskId, fromColumn);

    task.column = toColumn;
    task.order = Math.max(...state.tasks[toColumn].map(t => t.order)) + 1;

    state.transferTask(task, fromColumn, toColumn);
    updateTask(task, fromColumn);
}

export function moveTaskToColumnEnd(taskId, column) {
    const task = getTaskOfColumn(taskId, column);
    task.order = Math.max(...state.tasks[column].map(t => t.order)) + 1;
    updateTask(task);
}
