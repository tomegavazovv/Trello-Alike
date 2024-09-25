import { deleteTask, saveTask } from "../db";
import { getTasksOfColumn, updateTasksOfColumn } from "../db";

export function transferTask(taskId, fromColumn, toColumn) {
  if (fromColumn === toColumn) {
    return false;
  }
  const deletedTask = deleteTask(taskId, fromColumn);
  saveTask(deletedTask.text, toColumn);

  return true;
}

export function reorderTask(taskId, column, targetTaskId) {
  const tasks = getTasksOfColumn(column);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  const targetIndex = tasks.findIndex(task => task.id === targetTaskId);

  if (taskIndex === -1 || targetIndex === -1) {
    return false;
  }

  const [movedTask] = tasks.splice(taskIndex, 1);
  tasks.splice(targetIndex, 0, movedTask);
  updateTasksOfColumn(tasks, column);

  return true;
}

export function isValidTask(value) {
  return value.trim() !== "";
}


