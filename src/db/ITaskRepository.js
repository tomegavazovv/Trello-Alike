/**
 * @interface ITaskRepository
 */
class ITaskRepository {
    async saveTask(task) {}

    async updateTask(task) {}

    async deleteTask(taskId) {}

    async getTasks() {}

    async updateTasksOrder(updatedTasks) {}

    async updateTaskColumn(taskId, newColumn, order) {}

    async getTaskOrder(taskId) {}

    async updateTaskOrder(taskId, newOrder) {}
}

export default ITaskRepository;