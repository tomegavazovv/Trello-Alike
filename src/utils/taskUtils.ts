import { Task } from "../models/Task";

export function isValidTask(value: string): boolean {
    return value.trim() !== "";
}

export function recalculateOrder(tasks: Task[]): Task[] {
    return tasks.map((task, index) => ({
        ...task,
        order: (index + 1) * 100
    }));
}