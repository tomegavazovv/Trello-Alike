function drag(event) {
  event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("id");
  const taskEl = document.getElementById(taskId);
  const fromColumn = taskId.split("-")[0];
  const toColumn = event.target.closest(".column").id;
  const taskIndex = tasks[fromColumn].indexOf(taskEl.textContent);

  if (fromColumn !== toColumn) {
    const task = tasks[fromColumn].splice(taskIndex, 1)[0];
    tasks[toColumn].push(task);
    saveTasks();
    renderTasks();
  }
}

function initDragEventListeners() {
  document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", drop);
  });
}
