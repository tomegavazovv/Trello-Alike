
export const getChangedFields = (prevState: any, newState: any, path: any[] = []): string[] => {
    const changedFields = [];

    // Base case for primitive values
    if (prevState === null || typeof prevState !== 'object') {
        if (prevState !== newState) {
            changedFields.push(path.join('.').replace(/\.\d+$/, ''));
        }
        return changedFields;
    }

    // Special handling for tasks
    if (path.length === 1 && path[0] === 'tasks') {
        for (const column in newState) {
            if (!areTaskArraysEqual(prevState[column], newState[column])) {
                changedFields.push(`tasks.${column}`);
            }
        }
        return changedFields;
    }

    // Recursive case for objects
    for (const key in newState) {
        const newPath = [...path, key];
        if (typeof newState[key] === 'object' && newState[key] !== null) {
            changedFields.push(...getChangedFields(prevState[key], newState[key], newPath));
        } else if (!Object.is(prevState[key], newState[key])) {
            changedFields.push(newPath.join('.').replace(/\.\d+$/, ''));
        }
    }

    // Check for fields that were removed
    for (const key in prevState) {
        if (!(key in newState)) {
            changedFields.push([...path, key].join('.').replace(/\.\d+$/, ''));
        }
    }

    return changedFields.filter(field => !field.startsWith('user'));
};

const areTaskArraysEqual = (prevTasks: any[], newTasks: any[]): boolean => {
    if (prevTasks.length !== newTasks.length) return false;
    
    for (let i = 0; i < prevTasks.length; i++) {
        const prevTask = prevTasks[i];
        const newTask = newTasks[i];
        
        if (!areTasksEqual(prevTask, newTask)) {
            return false;
        }
    }
    
    return true;
};

const areTasksEqual = (task1: any, task2: any): boolean => {
    const allKeys = new Set([...Object.keys(task1), ...Object.keys(task2)]);
    return Array.from(allKeys).every(key => task1[key] === task2[key]);
};