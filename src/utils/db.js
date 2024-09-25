import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, where, serverTimestamp, writeBatch, getDoc } from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

export async function saveTask(task) {
    task.createdAt = new Date();
    task.updatedAt = new Date();

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), task);
    const addedTask = { id: docRef.id, ...task };
    return addedTask;
}

export async function updateTask(task) {
    updateDoc(doc(db, TASKS_COLLECTION, task.id), {
        ...task,
        updatedAt: serverTimestamp()
    });
}

export async function updateTasksOrder(updatedTasks) {
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

export function deleteTask(task) {
    deleteDoc(doc(db, TASKS_COLLECTION, task.id));
}

export async function getTasks() {
    const tasksSnapshot = await getDocs(collection(db, TASKS_COLLECTION));
    const tasks = { todo: [], inprogress: [], done: [] };
    tasksSnapshot.forEach(doc => {
        const task = { id: doc.id, ...doc.data() };
        tasks[task.column].push(task);
    });
    return tasks;
}

export async function updateTaskColumn(taskId, newColumn) {
    await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
        column: newColumn,
        updatedAt: serverTimestamp()
    });
}

export async function getTaskOrder(taskId) {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    const docSnap = await getDoc(docRef);
    return docSnap.data().order;
}

export async function updateTaskOrder(taskId, newOrder) {
    await updateDoc(doc(db, TASKS_COLLECTION, taskId), { order: newOrder });
}
