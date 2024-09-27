import ITaskRepository from './ITaskRepository';

const TASKS_KEY = 'tasks';

class LocalStorageTaskRepository extends ITaskRepository {

    async saveTask(task, userId) {
        const tasks = this._getTasksFromStorage(userId);
        task.id = Math.random().toString(36).slice(2, 10);
        task.createdAt = new Date();
        task.updatedAt = new Date();
        tasks[task.column].push(task);
        this._saveTasksToStorage(tasks, userId);
        return task;
    }

    async updateTask(task, userId) {
        const tasks = this._getTasksFromStorage(userId);
        for(const column in tasks) {
            const index = tasks[column].findIndex(t => t.id === task.id);
            if (index !== -1) {
                tasks[column][index] = { ...tasks[column][index], ...task, updatedAt: new Date() };
                this._saveTasksToStorage(tasks, userId);
                break;
            }
        }
    }

    async deleteTask(taskId, userId) {
        const tasks = this._getTasksFromStorage(userId);
        for (const column in tasks) {
            tasks[column] = tasks[column].filter(task => task.id !== taskId);
        }
        this._saveTasksToStorage(tasks, userId);
    }

    async getTasks(userId) {
        return this._getTasksFromStorage(userId);
    }

    async updateTasksOrder(updatedTasks) {
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

    async updateTaskColumn(taskId, newColumn, order, userId) {
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
            task.column = newColumn;
            task.order = order;
            tasks[newColumn].push(task);
            this._saveTasksToStorage(tasks);
        }
    }

    async getTaskOrder(taskId, userId) {
        const tasks = this._getTasksFromStorage(userId);
        for (const column in tasks) {
            const task = tasks[column].find(t => t.id === taskId);
            if (task) {
                return task.order;
            }
        }
        return null;
    }

    async updateTaskOrder(taskId, newOrder, userId) {
        const tasks = this._getTasksFromStorage(userId);
        for (const column in tasks) {
            const task = tasks[column].find(t => t.id === taskId);
            if (task) {
                task.order = newOrder;
                this._saveTasksToStorage(tasks, userId);
                break;
            }
        }
    }

    _getTasksFromStorage(userId) {
        const allUsersTasksJson = localStorage.getItem(TASKS_KEY);
        const allUsersTasks = allUsersTasksJson ? JSON.parse(allUsersTasksJson) : {};
        return allUsersTasks[userId] || { todo: [], inprogress: [], done: [] };
    }

    _saveTasksToStorage(tasks, userId) {
        const allUsersTasksJson = localStorage.getItem(TASKS_KEY);
        const allUsersTasks = allUsersTasksJson ? JSON.parse(allUsersTasksJson) : {};
        allUsersTasks[userId] = tasks;
        localStorage.setItem(TASKS_KEY, JSON.stringify(allUsersTasks));
    }
}

export default LocalStorageTaskRepository;