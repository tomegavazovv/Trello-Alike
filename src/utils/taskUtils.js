export function isValidTask(value) {
  return value.trim() !== "";
}

export function recalculateOrder(tasks) {
  return tasks.map((task, index) => ({
    ...task,
    order: (index + 1) * 100
  }));
}