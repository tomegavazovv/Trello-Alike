function handleAddTask(event) {
    const column = event.target.closest(".column").id;
    const input = getTaskInputElement(column);
    const value = input.value;

    if (isValidTask(value)) {
        resetInput(input);
        saveTask(value, column);
        renderTasks();
    }
}

function deleteTaskHandler(event) {
    const taskId = event.target.closest(".task").id;
    const column = event.target.closest(".column").id;
    deleteTask(taskId, column);
    renderTasks();
}

function handleTaskTextUpdate(event) {
    event.target.contentEditable = false;
    const column = event.target.closest(".column").id;
    const taskId = event.target.closest(".task").id;
    const updatedText = event.target.textContent.trim();
    const originalText = event.target.dataset.originalText;

    if (updatedText !== originalText) {
        updateTaskText(taskId, column, updatedText);
        renderTasks();
    }
}

function handleTaskDoubleClick(event) {
    const taskText = event.target;
    taskText.contentEditable = true;
    taskText.focus();
}

function dropHandler(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("id");
    const fromColumn = event.dataTransfer.getData("fromColumn");
    const toColumn = event.target.closest(".column").id;

    if (fromColumn === toColumn) {
        _handleSameColumnDrop(event, taskId, toColumn);
    } else {
        _handleDifferentColumnDrop(taskId, fromColumn, toColumn);
    }
}

function dragStartHandler(event) {
    event.dataTransfer.setData("id", event.target.id);
    event.dataTransfer.setData("fromColumn", event.target.closest(".column").id);
    event.dataTransfer.effectAllowed = "move";
    event.target.style.opacity = "0.3";
}

function dragEndHandler(event) {
    event.target.style.opacity = "1";
}

function allowDrop(event) {
    event.preventDefault();
}

function _handleSameColumnDrop(event, taskId, column) {
    const targetTask = event.target.closest(".task");
    if (!targetTask || targetTask.id === taskId) return;

    if (reorderTask(taskId, column, targetTask.id)) {
        renderTasks();
    }
}

function _handleDifferentColumnDrop(taskId, fromColumn, toColumn) {
    if (transferTask(taskId, fromColumn, toColumn)) {
        renderTasks();
    }
}