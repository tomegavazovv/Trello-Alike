import { getChangedFields } from "./utils";
import { Column, Task, TaskColumns } from "../models/Task.js";
import { User } from "@firebase/auth";
import { Action } from "./actions";
import Component from "../components/Component.js";

interface State {
    tasks: TaskColumns,
    user: User | null,
    authError: string | null
}

interface ComponentListeners {
    [key: string]: Component[]
}

const initialState: State = {
    tasks: {
        todo: [],
        inprogress: [],
        done: []
    },
    user: null,
    authError: null
};

const store = {
    state: initialState,
    listeners: [] = [],
    loginUserListeners: [] = [],
    componentListeners: {} as ComponentListeners,

    setTasks(tasks: TaskColumns) {
        this.state.tasks = tasks
    },

    getTaskOfColumn(taskId: string, column: Column) {
        return this.state.tasks[column].find((t: Task) => t.id === taskId);
    },

    getTasksOfColumn(column: Column) {
        return this.state.tasks[column];
    },

    dispatch(action: Action) {
        const prevState = JSON.parse(JSON.stringify(this.state));
        this.state = this.reducer(this.state, action);

        const changedFields = Array.from(new Set(getChangedFields(prevState, this.state)));
        for (const field of changedFields) {
            const components = this.componentListeners[field] || [];
            for (const component of components) {
                component.componentDidUpdate()
            }
        }

        if (action.type === 'SET_USER') {
            this.notifyLoginUserListeners();
        } else {
            this.notifyListeners();
        }
    },

    reducer(state: State, action: Action): State {
        switch (action.type) {
            case 'ADD_TASK':
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [action.payload.column]: [...state.tasks[action.payload.column], action.payload.task]
                    } as TaskColumns
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

    addListener(listener: () => void) {
        this.listeners.push(listener);
    },

    addComponentListener(selector: string, component: Component) {
        if (!this.componentListeners[selector]) {
            this.componentListeners[selector] = [];
        }
        this.componentListeners[selector].push(component);
    },

    addLoginUserListener(listener: () => void) {
        this.loginUserListeners.push(listener);
    },

    removeListener(listener: () => void) {
        this.listeners = this.listeners.filter((l: () => void) => l !== listener);
    },

    notifyListeners() {
        this.listeners.forEach((listener: () => void) => listener());
    },

    notifyLoginUserListeners() {
        this.componentListeners['user.uid'] && this.componentListeners['user.uid'].forEach((comp: Component) => comp.componentDidUpdate());
        this.loginUserListeners.forEach((listener: () => void) => listener());
    }
};

export default store;

export const tasksSelector = () => () => 'tasks';

export const tasksColumnSelector = (column: string) => {
    return () => `tasks.${column}`
};

export const userIdSelector = () => () => 'user.uid';

export const taskSelector = (taskId: string, column: string) => {
    const index = store.state.tasks[column].findIndex(task => task.id == taskId)
    return () => `tasks.${column}[${index}]`;
}

export const useSelector = (selector: () => string, component: Component) => {
    const selectorKey = selector();
    if (!store.componentListeners[selectorKey]) {
        store.componentListeners[selectorKey] = [];
    }

    if (!store.componentListeners[selectorKey].find(c => c.id === component.id)) {
        store.componentListeners[selectorKey].push(component);
    }
    try {
        return eval(`store.state.${selectorKey}`)
    } catch (e) {
        return null
    }
}