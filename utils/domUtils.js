function resetInput(input) {
  input.value = "";
}

function getTaskInputEl(column) {
  return document.getElementById(column).querySelector("input");
}

function getTasksColumnElement(column) {
  return document.getElementById(column).querySelector(".tasks");
}

function clearColumnTasks(columnEl) {
  columnEl.innerHTML = "";
}

function createTaskContainerItem(taskId) {
  const props = {
    className: "task",
    id: taskId,
    draggable: true,
  };
  const taskContainerEl = createDOMElement("div", props);
  listenDrag(taskContainerEl);

  return taskContainerEl;
}

function createTaskTextElement(taskText) {
  const props = { textContent: taskText };
  return createDOMElement("span", props);
}

function createDeleteTaskButton(taskId) {
  const props = {
    textContent: "X",
    className: "delete-btn",
    onclick: deleteTask,
    id: `delete-${taskId}`,
  };
  return createDOMElement("button", props);
}

function createDOMElement(type, props) {
  const element = document.createElement(type);
  Object.keys(props).forEach((key) => {
    element[key] = props[key];
  });
  return element;
}
