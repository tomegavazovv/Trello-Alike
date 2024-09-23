

function getTaskInputEl(column) {
  return document.getElementById(column).querySelector("input");
}

function isValidTaskInput(value) {
  return value.trim() !== "";
}

function resetInput(input) {
  input.value = "";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return (
    JSON.parse(localStorage.getItem("tasks")) || {
      todo: [],
      inprogress: [],
      done: [],
    }
  );
}


