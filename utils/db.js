const tasks =
    readFromLocalStorageAsJSON("tasks") || {
        todo: [],
        inprogress: [],
        done: [],
    };

function saveTask(taskText, column) {
    const id = Math.random().toString(36).slice(8);
    tasks[column].push({ id, text: taskText });
    saveTasks();
}

function deleteTask(taskId, fromColumn) {
    const taskIndex = tasks[fromColumn].findIndex(task => task.id === taskId);
    const deletedTask = tasks[fromColumn].splice(taskIndex, 1)[0];
    saveTasks();
    return deletedTask;
  }

function getTask(taskId, fromColumn) {
    return tasks[fromColumn].find(task => task.id === taskId);
}

function saveTasks() {
    saveToLocalStorageAsJSON("tasks", tasks);
}

function getTasks() {
    return tasks;
}

