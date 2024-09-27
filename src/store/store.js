const initialState = {
    tasks: {
        todo: [],
        inprogress: [],
        done: []
    },
    user: null
};

const store = {
    state: initialState,
    listeners: [],
    loginUserListeners: [],


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
        if(action.type === 'SET_USER'){
            this.notifyLoginUserListeners();
        }else{
            this.notifyListeners();
        }
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
                const { taskId, fromColumn, toColumn, order } = action.payload;
                const fromTasks = state.tasks[fromColumn];
                const toTasks = state.tasks[toColumn];
                const taskIndex = fromTasks.findIndex(t => t.id === taskId);

                if (taskIndex === -1) {
                    return state;
                }

                const [task] = fromTasks.splice(taskIndex, 1);
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [fromColumn]: fromTasks,
                        [toColumn]: [...toTasks, { ...task, column: toColumn, order }]
                    }
                };
            case 'SET_USER':
                return {
                    ...state,
                    user: action.payload.user
                };
            case 'CLEAR_USER':
                return {
                    ...initialState,
                };
            case 'SET_AUTH_ERROR':
                return {
                    ...state,
                    authError: action.payload.error
                };
            case 'REFRESH_TASKS':
                return {
                    ...state,
                    tasks: action.payload.tasks
                };
            default:
                return state;
        }
    },

    addListener(listener) {
        this.listeners.push(listener);
    },

    addLoginUserListener(listener) {
        this.loginUserListeners.push(listener);
    },

    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    },

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    },

    notifyLoginUserListeners() {
        this.loginUserListeners.forEach(listener => listener());
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
    updateTasksOrder: (updatedTasks, column) => ({
        type: 'UPDATE_TASKS_ORDER', payload: { column, updatedTasks }
    }),
    transferTask: (taskId, fromColumn, toColumn, order) => ({
        type: 'TRANSFER_TASK', payload: { taskId, fromColumn, toColumn, order }
    }),
    setUser: (user) => ({
        type: 'SET_USER', payload: { user }
    }),
    clearUser: () => ({
        type: 'CLEAR_USER'
    }),
    setAuthError: (error) => ({
        type: 'SET_AUTH_ERROR', payload: { error }
    }),
    refreshTasks: (tasks) => ({
        type: 'REFRESH_TASKS', payload: { tasks }
    })
};

