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
  const deletedTask = tasks[fromColumn].splice(taskIndex, 1);
  saveTasks();
  return deletedTask;
}

function deleteTaskByIdAndColumn(taskId, column) {
  const taskIndex = getIndexOfTask(taskId);
  const deletedTask = tasks[column].splice(taskIndex, 1);
  saveTasks();
  return deletedTask;
}

function transferTask(taskId, toColumn) {
  const fromColumn = getColumnOfTask(taskId);
  if (fromColumn === toColumn) {
    return false;
  }
  const deletedTask = deleteTaskById(taskId, fromColumn);
  saveTask(toColumn, deletedTask);

  return true;
}

function saveTask(column, taskText) {
  tasks[column].push(taskText);
  saveTasks();
}

function getTaskId(column, index) {
  return `${column}-task-${index}`;
}

function isValidTask(value) {
  return value.trim() !== "";
}

function getColumnOfTask(id) {
  return id.split("-")[0];
}

function getIndexOfTask(id) {
  return id.split("-")[2];
}
