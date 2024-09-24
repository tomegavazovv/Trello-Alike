renderTasks();

function addTaskEventListeners() {
  document.querySelectorAll(".add-task-btn").forEach(btn => {
    btn.addEventListener("click", handleAddTask);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", deleteTaskHandler);
  });
}

function addDragEventListeners() {
    document.querySelectorAll(".column").forEach((column) => {
        column.addEventListener("dragover", allowDrop);
        column.addEventListener("drop", dropHandler);
    });
    document.querySelectorAll(".task").forEach((task) => {
      task.addEventListener("dragstart", dragStartHandler);
      task.addEventListener("dragend", dragEndHandler);
    });
}