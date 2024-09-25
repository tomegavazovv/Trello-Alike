export function resetInput(input) {
  input.value = "";
}

export function getTaskInputElement(column) {
  return document.getElementById(column).querySelector("#todo-input");
}

export function getTasksColumnElement(column) {
  return document.getElementById(column).querySelector(".tasks");
}

export function clearColumnTasks(columnEl) {
  columnEl.innerHTML = "";
}

export function createTaskContainerItem(taskId) {
  const props = {
    className: "task",
    id: taskId,
    draggable: true,
  };
  const taskContainerEl = createDOMElement("div", props);
  return taskContainerEl;
}

export function createTaskTextElement(task) {
  const props = { 
    textContent: task.text, 
    className: "task-text", 
    id: `task-text-${task.id}` ,
    dataset: { originalText: task.text }
  };

  return createDOMElement("span", props);
}

export function createDeleteTaskButton(taskId) {
  const props = {
    textContent: "X",
    className: "delete-btn",
    id: `delete-${taskId}`,
  };
  return createDOMElement("button", props);
}

export function getNearestElementByMouseY(selector, mouseY) {
  const elementsInColumn = Array.from(document.querySelectorAll(`${selector}`));
  const result = elementsInColumn.reduce((closest, element) => {
    const box = element.getBoundingClientRect();
    const offset = mouseY - box.top - box.height / 2;
    const absOffset = Math.abs(offset);
    if (absOffset < Math.abs(closest.offset)) {
      return { offset: offset, element: element };
    } else {
      return closest;
    }
  }, { offset: Infinity, element: null });

  return result.element;
}

export function createDOMElement(type, props) {
  const element = document.createElement(type);
  Object.keys(props).forEach((key) => {
    if (key === 'dataset') {
      Object.assign(element.dataset, props[key]);
    } else {
      element[key] = props[key];
    }
  });
  return element;
}
