import { writeBatch } from "@firebase/firestore";
import { updateTaskColumn, updateTaskOrder } from "../db";
import { db } from "../../firebaseConfig";

export async function transferTask(taskId, fromColumn, toColumn) {
  if (fromColumn === toColumn) {
    return false;
  }
  await updateTaskColumn(taskId, toColumn);
  return true;
}

export function isValidTask(value) {
  return value.trim() !== "";
}

export function recalculateOrder(tasks) {
  return tasks.map((task, index) => ({
      ...task,
      order: (index + 1) * 1000
  }));
}