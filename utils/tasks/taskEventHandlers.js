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

function dropHandler(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("id");
    const fromColumn = event.dataTransfer.getData("fromColumn");
    const toColumn = event.target.closest(".column").id;

    if (fromColumn === toColumn) {
        handleSameColumnDrop(event, taskId, toColumn);
    } else {
        handleDifferentColumnDrop(taskId, fromColumn, toColumn);
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

function handleSameColumnDrop(event, taskId, column) {
    const targetTask = event.target.closest(".task");
    if (!targetTask || targetTask.id === taskId) return;

    if (reorderTask(taskId, column, targetTask.id)) {
        renderTasks();
    }
}

function handleDifferentColumnDrop(taskId, fromColumn, toColumn) {
    if (transferTask(taskId, fromColumn, toColumn)) {
        renderTasks();
    }
}