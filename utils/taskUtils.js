function getTasks() {
  return (
    readFromLocalStorageAsJSON("tasks") || {
      todo: [],
      inprogress: [],
      done: [],
    }
  );
}

function saveTasks() {
  saveToLocalStorageAsJSON("tasks", tasks);
}

function deleteTaskById(taskId) {
  const taskIndex = getIndexOfTask(taskId);
  const fromColumn = getColumnOfTask(taskId);
  tasks[fromColumn].splice(taskIndex, 1);
  saveTasks();
  renderTasks();
}

function saveTask(column, taskText) {
  tasks[column].push(taskText);
  saveTasks();
  renderTasks();
}

function getTaskId(column, index) {
  return `${column}-task-${index}`;
}

function isValidTaskInput(value) {
  return value.trim() !== "";
}

function getColumnOfTask(id) {
  return id.split("-")[0];
}

function getIndexOfTask(id) {
  return id.split("-")[2];
}
