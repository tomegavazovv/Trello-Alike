import { Task, TaskColumns, TaskInput } from '../models/Task';
import ITaskRepository from './ITaskRepository';

const TASKS_KEY = 'tasks';

class LocalStorageTaskRepository implements ITaskRepository {

    async saveTask(task: TaskInput, userId: string): Promise<Task> {
        const tasks = this._getTasksFromStorage(userId);
        const newTask: Task = {
            ...task,
            createdAt: new Date(),  
            updatedAt: new Date()
        }
        tasks[task.column].push(newTask);
        this._saveTasksToStorage(tasks, userId);
        return newTask;
    }

    async updateTask(task: Task, userId: string): Promise<Task> {
        const tasks = this._getTasksFromStorage(userId);
        for (const column in tasks) {
            const index = tasks[column].findIndex((t: Task) => t.id === task.id);
            if (index !== -1) {
                tasks[column][index] = { ...tasks[column][index], ...task, updatedAt: new Date() };
                this._saveTasksToStorage(tasks, userId);
                return { ...tasks[column][index], ...task, updatedAt: new Date() };
            }
        }
    }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        const tasks = this._getTasksFromStorage(userId);
        for (const column in tasks) {
            tasks[column] = tasks[column].filter((task: Task) => task.id !== taskId);
        }
        this._saveTasksToStorage(tasks, userId);
    }

    async getTasks(userId: string): Promise<TaskColumns> {
        console.log('gettasks')
        return this._getTasksFromStorage(userId);
    }

    async updateTasksOrder(updatedTasks: Task[], userId: string): Promise<void> {
        const tasks = this._getTasksFromStorage(userId);
        updatedTasks.forEach(updatedTask => {
            const column = tasks[updatedTask.column];
            const index = column.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                column[index] = { ...column[index], order: updatedTask.order };
            }
        });
        this._saveTasksToStorage(tasks, userId);
    }

    async updateTaskColumn(taskId: string, newColumn: string, order: number, userId: string): Promise<Task> {
        const tasks = this._getTasksFromStorage(userId);
        let task;
        for (const column in tasks) {
            const index = tasks[column].findIndex(t => t.id === taskId);
            if (index !== -1) {
                task = tasks[column].splice(index, 1)[0];
                break;
            }
        }
        if (task) {
            task.column = newColumn as 'todo' | 'inProgress' | 'done';
            task.order = order;
            tasks[newColumn].push(task);
            this._saveTasksToStorage(tasks, userId);
            return task;
        }
    }

    async getTaskOrder(taskId: string, userId: string): Promise<number> {
        const tasks = this._getTasksFromStorage(userId);
        let taskOrder = -1;
        for (const column in tasks) {
            const task = tasks[column].find(t => t.id === taskId);
            if (task) {
                taskOrder = task.order;
                break;
            }
        }
        return new Promise((resolve) => resolve(taskOrder));
    }

    async updateTaskOrder(taskId: string, newOrder: number, userId: string): Promise<Task> {
        const tasks = this._getTasksFromStorage(userId);
        let task: Task | null = null;
        for (const column in tasks) {
            task = tasks[column].find(t => t.id === taskId);
            if (task) {
                task.order = newOrder;
                this._saveTasksToStorage(tasks, userId);
                break;
            }
        }
        return new Promise((resolve) => resolve(task));
    }

    _getTasksFromStorage(userId: string): TaskColumns {
        const allUsersTasksJson = localStorage.getItem(TASKS_KEY);
        const allUsersTasks = allUsersTasksJson ? JSON.parse(allUsersTasksJson) : {};
        return allUsersTasks[userId] || { todo: [], inprogress: [], done: [] };
    }

    _saveTasksToStorage(tasks: TaskColumns, userId: string) {
        const allUsersTasksJson = localStorage.getItem(TASKS_KEY);
        const allUsersTasks = allUsersTasksJson ? JSON.parse(allUsersTasksJson) : {};
        allUsersTasks[userId] = tasks;
        localStorage.setItem(TASKS_KEY, JSON.stringify(allUsersTasks));
    }
}

export default LocalStorageTaskRepository;