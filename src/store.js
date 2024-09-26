const store = {
    state: {
        tasks: {
            todo: [],
            inprogress: [],
            done: []
        }
    },
    listeners: [],


    setTasks(tasks) {
        this.state.tasks = tasks
    },

    getTaskOfColumn(taskId, column) {
        return this.state.tasks[column].find(t => t.id === taskId);
    },

    getTasksOfColumn(column) {
        return this.state.tasks[column];
    },

    dispatch(action) {
        this.state = this.reducer(this.state, action);
        this.notifyListeners();
    },

    reducer(state, action) {
        switch (action.type) {
            case 'ADD_TASK':
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [action.payload.column]: [...state.tasks[action.payload.column], action.payload.task]
                    }
                };
            case 'DELETE_TASK':
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [action.payload.column]: state.tasks[action.payload.column].filter(t => t.id !== action.payload.taskId)
                    }
                };
            case 'UPDATE_TASK':
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [action.payload.task.column]: state.tasks[action.payload.task.column].map(t => t.id === action.payload.task.id ? action.payload.task : t)
                    }
                };
            case 'UPDATE_TASKS_ORDER':
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [action.payload.column]: action.payload.updatedTasks
                    }
                };
            case 'TRANSFER_TASK':
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [action.payload.fromColumn]: state.tasks[action.payload.fromColumn].filter(t => t.id !== action.payload.updatedTask.id),
                        [action.payload.updatedTask.column]: [...state.tasks[action.payload.updatedTask.column], action.payload.updatedTask]
                    }
                };
            default:
                return state;
        }
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

export default store;

export const actions = {
    addTask: (task, column) => ({
        type: 'ADD_TASK', payload: { task, column }
    }),
    deleteTask: (taskId, column) => ({
        type: 'DELETE_TASK', payload: { taskId, column }
    }),
    updateTask: (task) => ({
        type: 'UPDATE_TASK', payload: { task }
    }),
    updateTasksOrder: (column, updatedTasks) => ({
        type: 'UPDATE_TASKS_ORDER', payload: { column, updatedTasks }
    }),
    transferTask: (updatedTask, fromColumn) => ({
        type: 'TRANSFER_TASK', payload: { updatedTask, fromColumn }
    }),
};

