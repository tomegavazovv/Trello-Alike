function renderTasks() {
  const tasks = getTasks();
  Object.entries(tasks).forEach(([column, columnTasks]) => {
    const columnEl = getTasksColumnElement(column);
    clearColumnTasks(columnEl);

    const taskElements = createTaskElements(column, columnTasks);
    appendTasksToColumn(columnEl, taskElements);
    addDragEventListeners();
    addTaskEventListeners();
  });
}

function appendTasksToColumn(columnEl, taskElements) {
  taskElements.forEach((taskEl) => columnEl.appendChild(taskEl));
}

function createTaskElements(column) {
  const tasks = getTasks();
  return tasks[column].map(task => createTaskElement( task));
}

function createTaskElement(task) {
  const taskEl = createTaskContainerItem(task.id);
  const taskTextEl = createTaskTextElement(task.text);
  const deleteBtnEl = createDeleteTaskButton(task.id);
  taskEl.appendChild(taskTextEl);
  taskEl.appendChild(deleteBtnEl);
  return taskEl;
}
