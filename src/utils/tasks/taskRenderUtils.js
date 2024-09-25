import { getTasksColumnElement, clearColumnTasks, createTaskContainerItem, createTaskTextElement, createDeleteTaskButton } from "../domUtils";
import state from "../../state.js";

export function renderTasks() {
  Object.entries(state.tasks).forEach(([column, columnTasks]) => {
    const columnEl = getTasksColumnElement(column);
    clearColumnTasks(columnEl);

    const taskElements = createTaskElements(columnTasks);
    appendTasksToColumn(columnEl, taskElements);
  });
}

function appendTasksToColumn(columnEl, taskElements) {
  taskElements.forEach((taskEl) => columnEl.appendChild(taskEl));
}

function createTaskElements(tasks) {
  return tasks.sort((t1, t2) => t1.order - t2.order).map(task => createTaskElement(task));
}

function createTaskElement(task) {
  const taskEl = createTaskContainerItem(task.id);
  const taskTextEl = createTaskTextElement(task);
  const deleteBtnEl = createDeleteTaskButton(task.id);
  taskEl.appendChild(taskTextEl);
  taskEl.appendChild(deleteBtnEl);

  return taskEl;
}