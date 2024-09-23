let tasks = getTasks();
console.log(tasks)
init();

function renderTasks() {
  Object.entries(tasks).forEach(([column, columnTasks]) => {
    const columnEl = getTasksColumnElement(column);
    clearColumnTasks(columnEl);

    const taskElements = createTaskElements(column, columnTasks);
    appendTasksToColumn(columnEl, taskElements);
  });
}

function addTask(column) {
  const input = getTaskInputEl(column);
  const value = input.value;

  if (isValidTaskInput(value)) {
    resetInput(input);
    saveTask(column, value);
    renderTasks()
  }
}

function deleteTask(event) {
  const taskId = event.target.id.split("delete-")[1];
  deleteTaskById(taskId);
  renderTasks()
}

function init() {
  renderTasks();
  initDragEventListeners();
}
