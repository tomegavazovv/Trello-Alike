import { deleteTask, saveTask, updateTask, updateTaskOrder, updateTasksOrder } from "../db";
import { recalculateOrder } from "./taskUtils";
import store, {actions} from "../../store.js";

export async function addTask(taskText, column) {
    const columnTasks = store.getTasksOfColumn(column);

    const maxOrder = columnTasks.length > 0
        ? Math.max(...columnTasks.map(t => t.order))
        : 0;

    const task = {
        text: taskText,
        column,
        order: maxOrder + 1,
    };

    const addedTask = await saveTask(task);

    store.dispatch(actions.addTask(addedTask, column));
    return addedTask;
}

export function deleteTaskFromColumn(taskId, column) {
    const task = store.getTaskOfColumn(taskId, column);
    
    store.dispatch(actions.deleteTask(taskId, column));
    deleteTask(task);
}

export function updateTaskText(taskId, newText, column) {
    const task = store.getTaskOfColumn(taskId, column);
    const newTask = {
        ...task,
        text: newText,
        updatedAt: new Date(),
    };

    store.dispatch(actions.updateTask(newTask));
    updateTask(newTask);
}

export function moveTaskAfter(taskId, targetTaskId, column) {
    const columnTasks = store.getTasksOfColumn(column);
    const taskIndex = columnTasks.findIndex(task => task.id === taskId);
    const targetIndex = targetTaskId
        ? columnTasks.findIndex(task => task.id === targetTaskId)
        : columnTasks.length - 1;

    const [movedTask] = columnTasks.splice(taskIndex, 1);
    columnTasks.splice(targetIndex, 0, movedTask);

    const updatedTasks = recalculateOrder(columnTasks);
    store.dispatch(actions.updateTasksOrder(column, updatedTasks));
    updateTasksOrder(updatedTasks);
}

export function moveTaskToColumn(taskId, fromColumn, toColumn) {
    const task = store.getTaskOfColumn(taskId, fromColumn);
    const newOrder = Math.max(...store.getTasksOfColumn(toColumn).map(t => t.order)) + 1;
    const newTask = {
        ...task,
        column: toColumn,
        order: newOrder,
    };

    store.dispatch(actions.transferTask(newTask, fromColumn));
    updateTask(newTask, fromColumn);
}

export function moveTaskToColumnEnd(taskId, column) {
    const task = store.getTaskOfColumn(taskId, column);
    task.order = Math.max(...store.getTasksOfColumn(column).map(t => t.order)) + 1;

    updateTask(task);
}
