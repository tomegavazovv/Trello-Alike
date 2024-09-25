import { getTasks } from "./utils/db.js";

const state = {
    tasks: {
        todo: [],
        inprogress: [],
        done: []
    },
    listeners: [],


    async initState() {
        this.tasks = await getTasks();
    },

    getTasksOfColumn(column) {
        return this.tasks[column];
    },

    addTask(task) {
        console.log(task)
        this.tasks[task.column].push(task);
    },

    getTaskOfColumn(taskId, column) {
        return this.tasks[column].find(t => t.id === taskId);
    },

    deleteTask(task) {
        this.tasks[task.column] = this.tasks[task.column].filter(t => t.id !== task.id);
    },

    updateTask(task) {
        this.tasks[task.column] = this.tasks[task.column].map(t => t.id === task.id ? task : t);
    },

    transferTask(task, fromColumn, toColumn) {
        this.tasks[toColumn].push(task);
        this.tasks[fromColumn] = this.tasks[fromColumn].filter(t => t.id !== task.id);
    },

    updateTasksOrder(updatedTasks, column) {
        this.tasks[column] = updatedTasks;
    },

    addListener(listener) {
        this.listeners.push(listener);
    },

    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    },

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }
};

const methodsToUpdate = ['addTask', 'deleteTask', 'updateTask', 'updateTasksOrder', 'transferTask'];
methodsToUpdate.forEach(method => {
    const originalMethod = state[method];
    state[method] = function(...args) {
        originalMethod.apply(this, args);
        this.notifyListeners();
    };
});

export default state;