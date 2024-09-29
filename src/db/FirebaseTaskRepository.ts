import ITaskRepository from './ITaskRepository';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, serverTimestamp, writeBatch, getDoc, query, where, DocumentSnapshot } from 'firebase/firestore';
import { Task, TaskColumns, TaskInput } from '../models/Task';

const TASKS_COLLECTION = 'tasks';

class FirebaseTaskRepository implements ITaskRepository {
    saveTask = async (task: TaskInput, userId: string): Promise<Task> => {
        const newTask: Task = {
            ...task,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, TASKS_COLLECTION), { ...newTask, userId });
        const addedTask = { id: docRef.id, ...newTask };
        return addedTask;
    }

    updateTask = async (task: Task, userId: string): Promise<Task> => {
        const taskRef = doc(db, TASKS_COLLECTION, task.id);

        const taskDoc = await getDoc(taskRef);

        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await updateDoc(taskRef, {
                ...task,
                updatedAt: serverTimestamp()
            });

            return { id: task.id, ...task };
        } else {
            throw new Error("Task not found or you don't have permission to update it");
        }
    }

    deleteTask = async (taskId: string, userId: string): Promise<void> => {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);

        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await deleteDoc(taskRef);
        } else {
            throw new Error("Task not found or you don't have permission to delete it");
        }
    }

    getTasks = async (userId: string): Promise<TaskColumns> => {
        const tasksRef = collection(db, TASKS_COLLECTION);
        const q = query(tasksRef, where('userId', '==', userId));
        const tasksSnapshot = await getDocs(q);
        
        const tasks: TaskColumns = {
            todo: [],
            inprogress: [],
            done: []
        };

        tasksSnapshot.forEach(doc => {
            const task = { id: doc.id, ...doc.data() } as Task;
            tasks[task.column].push(task);
        });
        return tasks;
    }

    updateTasksOrder = async (updatedTasks: Task[], userId: string): Promise<void> => {
        const batch = writeBatch(db);
        updatedTasks.forEach(task => {
            const taskRef = doc(db, TASKS_COLLECTION, task.id);
            batch.update(taskRef, {
                order: task.order,
                updatedAt: serverTimestamp()
            });
        });
        await batch.commit();
        console.log('Tasks updated successfully');
    }

    updateTaskColumn = async (taskId: string, newColumn: string, order: number, userId: string): Promise<Task> => {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);
        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await updateDoc(taskRef, {
                column: newColumn,
                order,
                updatedAt: serverTimestamp()
            });
            return { id: taskId, ...taskDoc.data() } as Task;
        } else {
            throw new Error("Task not found or you don't have permission to update it");
        }
    }

    getTaskOrder = async (taskId: string, userId: string): Promise<number> => {
        const docRef = doc(db, TASKS_COLLECTION, taskId);
        const docSnap = await getDoc(docRef);
        return docSnap.data().order;
    }

    updateTaskOrder = async (taskId: string, newOrder: number, userId: string): Promise<Task> => {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);

        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await updateDoc(taskRef, { order: newOrder });
            return { id: taskId, ...taskDoc.data() } as Task;
        } else {
            throw new Error("Task not found or you don't have permission to update it");
        }
    }

    isUserOwnerOfTask = (taskDoc: DocumentSnapshot, userId: string): boolean => {
        return taskDoc.exists() && taskDoc.data().userId === userId;
    }
}

export default FirebaseTaskRepository;