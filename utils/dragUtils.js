function initDragEventListeners() {
  document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", dropHandler);
  });
}

function listenDrag(el) {
  el.addEventListener("dragstart", dragHandler);
}

function dragHandler(event) {
  event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropHandler(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("id");
  const fromColumn = getColumnOfTask(taskId)
  const toColumn = event.target.closest(".column").id;
  const taskIndex = getIndexOfTask(taskId)

  if (fromColumn !== toColumn) {
    const task = tasks[fromColumn].splice(taskIndex, 1)[0];
    tasks[toColumn].push(task);
    saveTasks();
    renderTasks();
  }
}
