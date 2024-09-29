import { Task, TaskColumns, TaskInput } from "../models/Task";

interface ITaskRepository {
    saveTask(task: TaskInput, userId: string): Promise<Task>;
    updateTask(task: Task, userId: string): Promise<Task>;
    deleteTask(taskId: string, userId: string): Promise<void>;
    getTasks(userId: string): Promise<TaskColumns>;
    updateTasksOrder(updatedTasks: Task[], userId: string): Promise<void>;
    updateTaskColumn(taskId: string, newColumn: string, order: number, userId: string): Promise<Task>;
    getTaskOrder(taskId: string, userId: string): Promise<number>;
    updateTaskOrder(taskId: string, newOrder: number, userId: string): Promise<Task>;
}

export default ITaskRepository;