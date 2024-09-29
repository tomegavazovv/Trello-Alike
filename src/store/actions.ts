import { User } from "@firebase/auth";
import { TaskInput, Column, Task, TaskColumns } from "../models/Task.js";

export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const UPDATE_TASKS_ORDER = 'UPDATE_TASKS_ORDER';
export const TRANSFER_TASK = 'TRANSFER_TASK';
export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export const REFRESH_TASKS = 'REFRESH_TASKS';

export type Action =
    | { type: typeof ADD_TASK; payload: { task: TaskInput; column: Column } }
    | { type: typeof DELETE_TASK; payload: { taskId: string; column: Column } }
    | { type: typeof UPDATE_TASK; payload: { task: Task } }
    | { type: typeof UPDATE_TASKS_ORDER; payload: { updatedTasks: Task[]; column: Column } }
    | { type: typeof TRANSFER_TASK; payload: { taskId: string; fromColumn: Column; toColumn: Column; order: number } }
    | { type: typeof SET_USER; payload: { user: User } }
    | { type: typeof CLEAR_USER }
    | { type: typeof SET_AUTH_ERROR; payload: { error: string } }
    | { type: typeof REFRESH_TASKS; payload: { tasks: TaskColumns } };

export const actions = {
    addTask: (task: TaskInput, column: Column): Action => ({ 
        type: ADD_TASK, 
        payload: { task, column } 
    }),
    deleteTask: (taskId: string, column: Column): Action => ({ 
        type: DELETE_TASK, 
        payload: { taskId, column } 
    }),
    updateTask: (task: Task): Action => ({ 
        type: UPDATE_TASK, 
        payload: { task } 
    }),
    updateTasksOrder: (updatedTasks: Task[], column: Column): Action => ({ 
        type: UPDATE_TASKS_ORDER, 
        payload: { updatedTasks, column } 
    }),
    transferTask: (taskId: string, fromColumn: Column, toColumn: Column, order: number): Action => ({
        type: TRANSFER_TASK, 
        payload: { taskId, fromColumn, toColumn, order }
    }),
    setUser: (user: User): Action => ({ 
        type: SET_USER, 
        payload: { user } 
    }),
    clearUser: (): Action => ({ type: CLEAR_USER }),
    setAuthError: (error: string): Action => ({ 
        type: SET_AUTH_ERROR, 
        payload: { error } 
    }),
    refreshTasks: (tasks: TaskColumns): Action => ({ 
        type: REFRESH_TASKS, 
        payload: { tasks } 
    })
};