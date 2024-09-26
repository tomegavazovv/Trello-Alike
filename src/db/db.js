import TaskRepositoryFactory from './TaskRepositoryFactory';

// firebase or locaStorage
const repository = TaskRepositoryFactory.getRepository('firebase'); 

export const saveTask = repository.saveTask.bind(repository);
export const updateTask = repository.updateTask.bind(repository);
export const deleteTask = repository.deleteTask.bind(repository);
export const getTasks = repository.getTasks.bind(repository);
export const updateTasksOrder = repository.updateTasksOrder.bind(repository);
export const updateTaskColumn = repository.updateTaskColumn.bind(repository);
export const getTaskOrder = repository.getTaskOrder.bind(repository);
export const updateTaskOrder = repository.updateTaskOrder.bind(repository);