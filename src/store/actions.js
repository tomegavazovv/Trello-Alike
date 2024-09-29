export const actions = {
    addTask: (task, column) => ({
        type: 'ADD_TASK',
        payload: { task, column }
    }),

    deleteTask: (taskId, column) => ({
        type: 'DELETE_TASK',
        payload: { taskId, column }
    }),

    updateTask: (task) => ({
        type: 'UPDATE_TASK',
        payload: { task }
    }),

    updateTasksOrder: (updatedTasks, column) => ({
        type: 'UPDATE_TASKS_ORDER',
        payload: { column, updatedTasks }
    }),

    transferTask: (taskId, fromColumn, toColumn, order) => ({
        type: 'TRANSFER_TASK',
        payload: { taskId, fromColumn, toColumn, order }
    }),

    setUser: (user) => ({
        type: 'SET_USER',
        payload: { user }
    }),

    clearUser: () => ({
        type: 'CLEAR_USER'
    }),

    setAuthError: (error) => ({
        type: 'SET_AUTH_ERROR',
        payload: { error }
    }),

    refreshTasks: (tasks) => ({
        type: 'REFRESH_TASKS',
        payload: { tasks }
    })
};
