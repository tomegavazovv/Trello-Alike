import { Task, TaskColumns, TaskInput } from '../models/Task';
import store from '../store/store';
import ITaskRepository from './ITaskRepository';

const TASKS_KEY = 'tasks';

class LocalStorageTaskRepository implements ITaskRepository {

    async saveTask(task: TaskInput): Promise<Task> {
        const tasks = this._getTasksFromStorage();
        const newTask: Task = {
            ...task,
            userId: store.state.user.uid,
            createdAt: new Date(),  
            updatedAt: new Date()
        }
        tasks[task.column].push(newTask);
        this._saveTasksToStorage(tasks);
        return newTask;
    }

    generateTaskId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    async updateTask(task: Task): Promise<void> {
        const tasks = this._getTasksFromStorage();
        for (const column in tasks) {
            const index = tasks[column].findIndex((t: Task) => t.id === task.id);
            if (index !== -1) {
                tasks[column][index] = { ...tasks[column][index], ...task, updatedAt: new Date() };
                this._saveTasksToStorage(tasks);
                return;
            }
        }
    }

    async deleteTask(taskId: string): Promise<void> {
        const tasks = this._getTasksFromStorage();
        for (const column in tasks) {
            tasks[column] = tasks[column].filter((task: Task) => task.id !== taskId);
        }
        this._saveTasksToStorage(tasks);
    }

    async getTasks(): Promise<TaskColumns> {
        console.log('gettasks')
        return this._getTasksFromStorage();
    }

    async updateTasksOrder(updatedTasks: Task[]): Promise<void> {
        const tasks = this._getTasksFromStorage();
        updatedTasks.forEach(updatedTask => {
            const column = tasks[updatedTask.column];
            const index = column.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                column[index] = { ...column[index], order: updatedTask.order };
            }
        });
        this._saveTasksToStorage(tasks);
    }

    async updateTaskColumn(taskId: string, newColumn: string, order: number): Promise<Task> {
        const tasks = this._getTasksFromStorage();
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
            this._saveTasksToStorage(tasks);
            return task;
        }
    }

    async getTaskOrder(taskId: string): Promise<number> {
        const tasks = this._getTasksFromStorage();
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

    async updateTaskOrder(taskId: string, newOrder: number): Promise<Task> {
        const tasks = this._getTasksFromStorage();
        let task: Task | null = null;
        for (const column in tasks) {
            task = tasks[column].find(t => t.id === taskId);
            if (task) {
                task.order = newOrder;
                this._saveTasksToStorage(tasks);
                break;
            }
        }
        return new Promise((resolve) => resolve(task));
    }

    _getTasksFromStorage(): TaskColumns {
        const allUsersTasksJson = localStorage.getItem(TASKS_KEY);
        const allUsersTasks = allUsersTasksJson ? JSON.parse(allUsersTasksJson) : {};
        return allUsersTasks[store.state.user.uid] || { todo: [], inprogress: [], done: [] };
    }

    _saveTasksToStorage(tasks: TaskColumns) {
        const allUsersTasksJson = localStorage.getItem(TASKS_KEY);
        const allUsersTasks = allUsersTasksJson ? JSON.parse(allUsersTasksJson) : {};
        allUsersTasks[store.state.user.uid] = tasks;
        localStorage.setItem(TASKS_KEY, JSON.stringify(allUsersTasks));
    }
}

export default LocalStorageTaskRepository;