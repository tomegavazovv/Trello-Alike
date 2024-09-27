import ITaskRepository from './ITaskRepository';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, serverTimestamp, writeBatch, getDoc, query, where } from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

class FirebaseTaskRepository extends ITaskRepository {
    constructor() {
        super();
    }

    async saveTask(task, userId) {
        console.log('saveTask')
        task.createdAt = new Date();
        task.updatedAt = new Date();

        const docRef = await addDoc(collection(db, TASKS_COLLECTION), { ...task, userId });
        const addedTask = { id: docRef.id, ...task };
        return addedTask;
    }

    async updateTask(task, userId) {
        const taskRef = doc(db, TASKS_COLLECTION, task.id);

        const taskDoc = await getDoc(taskRef);

        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await updateDoc(taskRef, {
                ...task,
                updatedAt: serverTimestamp()
            });
        } else {
            throw new Error("Task not found or you don't have permission to update it");
        }
    }

    async deleteTask(taskId, userId) {
        console.log(taskId, userId)
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);

        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await deleteDoc(taskRef);
        } else {
            throw new Error("Task not found or you don't have permission to delete it");
        }
    }

    async getTasks(userId) {
        const tasksRef = collection(db, TASKS_COLLECTION);
        const q = query(tasksRef, where('userId', '==', userId));
        const tasksSnapshot = await getDocs(q);

        const tasks = { todo: [], inprogress: [], done: [] };
        tasksSnapshot.forEach(doc => {
            const task = { id: doc.id, ...doc.data() };
            tasks[task.column].push(task);
        });
        return tasks;
    }

    async updateTasksOrder(updatedTasks) {
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

    async updateTaskColumn(taskId, newColumn, order, userId) {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);
        if (this.isUserOwnerOfTask(taskDoc, userId)) {
            await updateDoc(taskRef, {
                column: newColumn,
                order,
                updatedAt: serverTimestamp()
            });
        } else {
            throw new Error("Task not found or you don't have permission to update it");
        }
    }

    async getTaskOrder(taskId) {
        const docRef = doc(db, TASKS_COLLECTION, taskId);
        const docSnap = await getDoc(docRef);
        return docSnap.data().order;
    }

    async updateTaskOrder(taskId, newOrder) {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        const taskDoc = await getDoc(taskRef);

        if (this.isUserOwnerOfTask(taskDoc)) {
            await updateDoc(taskRef, { order: newOrder });
        } else {
            throw new Error("Task not found or you don't have permission to update it");
        }
    }

    isUserOwnerOfTask(taskDoc, userId) {
        return taskDoc.exists() && taskDoc.data().userId === userId;
    }
}

export default FirebaseTaskRepository;