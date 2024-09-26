import ITaskRepository from './ITaskRepository';

const TASKS_KEY = 'tasks';

class LocalStorageTaskRepository extends ITaskRepository {

    async saveTask(task) {
        const tasks = this._getTasksFromStorage();
        task.id = Math.random().toString(36).slice(2, 10);
        task.createdAt = new Date();
        task.updatedAt = new Date();
        tasks[task.column].push(task);
        this._saveTasksToStorage(tasks);
        return task;
    }

    async updateTask(task) {
        console.log(task)

        const tasks = this._getTasksFromStorage();
        for(const column in tasks) {
            const index = tasks[column].findIndex(t => t.id === task.id);
            if (index !== -1) {
                console.log('Updating task', tasks[column][index])
                tasks[column][index] = { ...tasks[column][index], ...task, updatedAt: new Date() };
                this._saveTasksToStorage(tasks);
                break;
            }
        }
    }

    async deleteTask(taskId) {
        const tasks = this._getTasksFromStorage();
        for (const column in tasks) {
            tasks[column] = tasks[column].filter(task => task.id !== taskId);
        }
        this._saveTasksToStorage(tasks);
    }

    async getTasks() {
        return this._getTasksFromStorage();
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

    async updateTaskColumn(taskId, newColumn, order) {
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

    async getTaskOrder(taskId) {
        const tasks = this._getTasksFromStorage();
        for (const column in tasks) {
            const task = tasks[column].find(t => t.id === taskId);
            if (task) {
                return task.order;
            }
        }
        return null;
    }

    async updateTaskOrder(taskId, newOrder) {
        const tasks = this._getTasksFromStorage();
        for (const column in tasks) {
            const task = tasks[column].find(t => t.id === taskId);
            if (task) {
                task.order = newOrder;
                this._saveTasksToStorage(tasks);
                break;
            }
        }
    }

    _getTasksFromStorage() {
        const tasksJson = localStorage.getItem(TASKS_KEY);
        return tasksJson ? JSON.parse(tasksJson) : { todo: [], inprogress: [], done: [] };
    }

    _saveTasksToStorage(tasks) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
}

export default LocalStorageTaskRepository;