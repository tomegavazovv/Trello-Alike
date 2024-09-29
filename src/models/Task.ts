import { FieldValue } from 'firebase/firestore';

export type Column = 'todo' | 'inProgress' | 'done';

export interface Task {
    id?: string,
    text: string,
    order: number,
    column: Column,
    userId?: string,
    updatedAt: Date | FieldValue,
    createdAt: Date | FieldValue
}

export interface TaskInput {
    text: string,
    column: Column,
    order: number,
}

export interface TaskColumns {
    [key: string]: Task[];
    todo: Task[];
    inprogress: Task[];
    done: Task[];
}