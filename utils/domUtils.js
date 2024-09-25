function resetInput(input) {
  input.value = "";
}

function getTaskInputElement(column) {
  return document.getElementById(column).querySelector("#todo-input");
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
  return taskContainerEl;
}

function createTaskTextElement(task) {
  const props = { 
    textContent: task.text, 
    className: "task-text", 
    id: `task-text-${task.id}` ,
    dataset: { originalText: task.text }
  };

  return createDOMElement("span", props);
}

function createDeleteTaskButton(taskId) {
  const props = {
    textContent: "X",
    className: "delete-btn",
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
