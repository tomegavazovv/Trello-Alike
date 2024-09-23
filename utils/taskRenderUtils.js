function appendTasksToColumn(columnEl, taskElements) {
  taskElements.forEach((taskEl) => columnEl.appendChild(taskEl));
}

function createTaskElements(column) {
  return tasks[column].map((task, index) => createTaskElement(column, task, index));
}

function createTaskElement(column, taskText, index) {
  const taskId = getTaskId(column, index);
  const taskEl = createTaskContainerItem(taskId);
  const taskTextEl = createTaskTextElement(taskText);
  const deleteBtnEl = createDeleteTaskButton(taskId);

  taskEl.appendChild(taskTextEl);
  taskEl.appendChild(deleteBtnEl);

  return taskEl;
}
