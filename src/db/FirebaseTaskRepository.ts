import ITaskRepository from './ITaskRepository';
import { auth, db } from '../firebaseConfig';
import { collection, deleteDoc, doc, updateDoc, getDocs, serverTimestamp, writeBatch, getDoc, query, where, setDoc, addDoc } from 'firebase/firestore';
import { Task, TaskColumns, TaskInput } from '../models/Task';

const TASKS_COLLECTION = 'tasks';

class FirebaseTaskRepository implements ITaskRepository {
    saveTask = async (task: TaskInput): Promise<Task> => {
        const userId = auth.currentUser.uid;
        const newTask: Task = {
            ...task,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
        await setDoc(doc(db, TASKS_COLLECTION, newTask.id), newTask);
        return newTask;
    }

    generateTaskId(): string {
        const newDocRef = doc(collection(db, TASKS_COLLECTION));
        return newDocRef.id;
    }

    updateTask = async (task: Task): Promise<void> => {
        const taskRef = doc(db, TASKS_COLLECTION, task.id);
        const taskDoc = await getDoc(taskRef);
        await updateDoc(taskRef, {
            ...task,
            updatedAt: serverTimestamp()
        });
        
    }

    deleteTask = async (taskId: string): Promise<void> => {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        await deleteDoc(taskRef);
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

    updateTasksOrder = async (updatedTasks: Task[]): Promise<void> => {
        const batch = writeBatch(db);
        updatedTasks.forEach(task => {
            const taskRef = doc(db, TASKS_COLLECTION, task.id);
            batch.update(taskRef, {
                order: task.order,
                updatedAt: serverTimestamp()
            });
        });
        await batch.commit();
    }

    updateTaskColumn = async (taskId: string, newColumn: string, order: number): Promise<Task> => {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);
        await updateDoc(taskRef, {
            column: newColumn,
            order,
            updatedAt: serverTimestamp()
        });
        return { id: taskId, ...taskDoc.data() } as Task;
    }

    getTaskOrder = async (taskId: string): Promise<number> => {
        const docRef = doc(db, TASKS_COLLECTION, taskId);
        const docSnap = await getDoc(docRef);
        return docSnap.data().order;
    }

    updateTaskOrder = async (taskId: string, newOrder: number): Promise<Task> => {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);

        await updateDoc(taskRef, { order: newOrder });
        return { id: taskId, ...taskDoc.data() } as Task;
    }
}

export default FirebaseTaskRepository;