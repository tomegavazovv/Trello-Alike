/**
 * @interface ITaskRepository
 */
class ITaskRepository {
    async saveTask(task, userId) {}

    async updateTask(task, userId) {}

    async deleteTask(taskId, userId) {}

    async getTasks(userId) {}

    async updateTasksOrder(updatedTasks) {}

    async updateTaskColumn(taskId, newColumn, order, userId) {}

    async getTaskOrder(taskId) {}

    async updateTaskOrder(taskId, newOrder) {}
}

export default ITaskRepository;