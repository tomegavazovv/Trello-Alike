let tasks = getTasks();
init();

function renderTasks() {
  Object.entries(tasks).forEach(([column, columnTasks]) => {
    const columnEl = getColumnElement(column);
    clearColumnTasks(columnEl);

    const taskElements = createTaskElements(column, columnTasks);
    appendTasksToColumn(columnEl, taskElements);
  });
}

function addTask(column) {
  const input = getTaskInputEl(column);
  const value = input.value;

  if (isValidTaskInput(value)) {
    tasks[column].push(value);
    resetInput(input);
    saveTasks();
    renderTasks();
  }
}

function deleteTask(event) {
  const taskId = event.target.id.split("delete-")[1];
  const taskIndex = taskId.split("-")[2];
  const fromColumn = event.target.id.split("-")[1];

  tasks[fromColumn].splice(taskIndex, 1);
  saveTasks();
  renderTasks();
}

function init() {
  renderTasks();
  initDragEventListeners();
}
