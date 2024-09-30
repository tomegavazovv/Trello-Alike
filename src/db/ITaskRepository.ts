import { Task, TaskColumns, TaskInput } from "../models/Task";

interface ITaskRepository {
    saveTask(task: TaskInput): Task;
    updateTask(task: Task): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
    getTasks(userId: string): Promise<TaskColumns>;
    updateTasksOrder(updatedTasks: Task[]): Promise<void>;
    updateTaskColumn(taskId: string, newColumn: string, order: number): Promise<Task>;
    getTaskOrder(taskId: string): Promise<number>;
    updateTaskOrder(taskId: string, newOrder: number): Promise<Task>;
}

export default ITaskRepository;