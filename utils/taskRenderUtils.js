function appendTasksToColumn(columnEl, taskElements) {
  taskElements.forEach((taskEl) => columnEl.appendChild(taskEl));
}

function createTaskElements(column, tasks) {
  return tasks.map((task, index) => _createTaskElement(column, task, index));
}

function clearColumnTasks(columnEl) {
  columnEl.innerHTML = "";
}

function _createTaskElement(column, taskText, index) {
  const taskId = generateTaskId(column, index);
  const taskEl = _createTaskContainerItem(taskId);
  const taskTextEl = _createTaskTextElement(taskText);
  const deleteBtnEl = _createDeleteButton(taskId);

  taskEl.appendChild(taskTextEl);
  taskEl.appendChild(deleteBtnEl);

  return taskEl;
}

function _createTaskContainerItem(taskId) {
  const taskContainerEl = document.createElement("div");
  taskContainerEl.className = "task";
  taskContainerEl.id = taskId;
  taskContainerEl.draggable = true;
  listenDrag(taskContainerEl);
  return taskContainerEl;
}

function _createTaskTextElement(task) {
  const taskText = document.createElement("span");
  taskText.textContent = task;
  return taskText;
}

function _createDeleteButton(taskId) {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = deleteTask;
  deleteBtn.id = `delete-${taskId}`;
  return deleteBtn;
}
