let tasks = getTasks();
init();

function renderTasks(tasks) {
  Object.entries(tasks).forEach(([column, columnTasks]) => {
    const columnEl = getTaskColumnElement(column);
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
    saveTasks(tasks);
    renderTasks(tasks);
  }
}

function deleteTask(event) {
  const taskId = event.target.id.split("delete-")[1];
  const taskIndex = getIndexOfTask(taskId);
  const fromColumn = getColumnOfTask(taskId);

  tasks[fromColumn].splice(taskIndex, 1);
  saveTasks(tasks);
  renderTasks(tasks);
}

function init() {
  renderTasks(tasks);
  initDragEventListeners();
}
