renderTasks();
addTaskEventListeners();
addDragEventListeners();


function addTaskEventListeners() {
  document.querySelector(".board").addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("add-task-btn")) {
      handleAddTask(event);
    } else if (target.classList.contains("delete-btn")) {
      deleteTaskHandler(event);
    }
  });

  document.querySelector(".board").addEventListener("dblclick", (event) => {
    if (event.target.classList.contains("task-text")) {
      event.target.contentEditable = true;
      event.target.focus();
    }
  });

  document.querySelector(".board").addEventListener("blur", (event) => {
    if (event.target.classList.contains("task-text")) {
      event.target.contentEditable = false;
      const column = event.target.closest(".column").id;
      handleTaskTextUpdate(event.target.dataset.originalText, column, event);
    }
  }, true);
}

function addDragEventListeners() {
  document.querySelector(".board").addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("task")) {
      dragStartHandler(event);
    }
  });

  document.querySelector(".board").addEventListener("dragend", (event) => {
    if (event.target.classList.contains("task")) {
      dragEndHandler(event);
    }
  });

  document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", dropHandler);
  });
}