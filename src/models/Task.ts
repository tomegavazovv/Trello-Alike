import { FieldValue } from 'firebase/firestore';

export type Column = 'todo' | 'inProgress' | 'done';

export interface Task {
    id?: string,
    text: string,
    order: number,
    column: Column,
    updatedAt: Date | FieldValue,
    createdAt: Date | FieldValue,
    userId: string
}

export interface TaskInput {
    text: string,
    column: Column,
    order: number,
    id: string
}

export interface TaskColumns {
    [key: string]: Task[];
    todo: Task[];
    inprogress: Task[];
    done: Task[];
}