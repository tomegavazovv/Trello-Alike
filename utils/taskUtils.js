function getTasks() {
  return (
    readFromLocalStorageAsJSON('tasks') || {
      todo: [],
      inprogress: [],
      done: [],
    }
  );
}

function saveTasks(tasks) {
  saveToLocalStorageAsJSON("tasks", tasks);
}

function isValidTaskInput(value) {
  return value.trim() !== "";
}

function resetInput(input) {
  input.value = "";
}

function getTaskInputEl(column) {
  return document.getElementById(column).querySelector("input");
}

function getTaskColumnElement(column) {
  return document.getElementById(column).querySelector(".tasks");
}

function generateTaskId(column, index) {
  return `${column}-task-${index}`;
}

function getColumnOfTask(id){
    return id.split("-")[0];
}

function getIndexOfTask(id){
    return id.split("-")[2];
}