import { DB_MODE } from '../config/config';
import TaskRepositoryFactory from './TaskRepositoryFactory';
import type ITaskRepository from './ITaskRepository';

// firebase or localStorage
const repository = TaskRepositoryFactory.getRepository(DB_MODE);

export const taskRepository: ITaskRepository = repository;

export const { 
  saveTask,
  updateTask,
  deleteTask,
  getTasks,
  updateTasksOrder,
  updateTaskColumn,
  getTaskOrder,
  updateTaskOrder
} = repository;