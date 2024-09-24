function transferTask(taskId, fromColumn, toColumn) {
  if (fromColumn === toColumn) {
    return false;
  }
  const deletedTask = deleteTask(taskId, fromColumn);
  saveTask(deletedTask.text, toColumn);

  return true;
}

function isValidTask(value) {
  return value.trim() !== "";
}


