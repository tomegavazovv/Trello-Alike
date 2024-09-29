import FirebaseTaskRepository from './FirebaseTaskRepository';
import LocalStorageTaskRepository from './LocalStorageTaskRepository';

class TaskRepositoryFactory {
    static getRepository(type = 'firebase') {
        switch (type) {
            case 'firebase':
                return new FirebaseTaskRepository();
            case 'localStorage':
                return new LocalStorageTaskRepository();
            default:
                throw new Error(`Unsupported repository type: ${type}`);
        }
    }
}

export default TaskRepositoryFactory;