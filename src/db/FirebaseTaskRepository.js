import ITaskRepository from './ITaskRepository';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, serverTimestamp, writeBatch, getDoc } from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

class FirebaseTaskRepository extends ITaskRepository {
    
    async saveTask(task) {
        task.createdAt = new Date();
        task.updatedAt = new Date();

        const docRef = await addDoc(collection(db, TASKS_COLLECTION), task);
        const addedTask = { id: docRef.id, ...task };
        return addedTask;
    }

    async updateTask(task) {
        await updateDoc(doc(db, TASKS_COLLECTION, task.id), {
            ...task,
            updatedAt: serverTimestamp()
        });
    }

    async deleteTask(taskId) {
        await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    }

    async getTasks() {
        const tasksSnapshot = await getDocs(collection(db, TASKS_COLLECTION));
        const tasks = { todo: [], inprogress: [], done: [] };
        tasksSnapshot.forEach(doc => {
            const task = { id: doc.id, ...doc.data() };
            tasks[task.column].push(task);
        });
        return tasks;
    }

    async updateTasksOrder(updatedTasks) {
        updatedTasks.forEach(task => {
            console.log(task.text)
        })
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

    async updateTaskColumn(taskId, newColumn, order) {
        await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
            column: newColumn,
            order,
            updatedAt: serverTimestamp()
        });
    }

    async getTaskOrder(taskId) {
        const docRef = doc(db, TASKS_COLLECTION, taskId);
        const docSnap = await getDoc(docRef);
        return docSnap.data().order;
    }

    async updateTaskOrder(taskId, newOrder) {
        await updateDoc(doc(db, TASKS_COLLECTION, taskId), { order: newOrder });
    }
}

export default FirebaseTaskRepository;