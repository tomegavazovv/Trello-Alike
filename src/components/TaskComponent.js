import store, { actions } from '../store/store.js';
import {  deleteTaskFromColumn, updateTaskText } from '../service/taskService.js';
import Component from './Component';

class TaskComponent extends Component {
    constructor(props) {
        super(props);
    }

    handleDelete = () => {
        store.dispatch(actions.deleteTask(this.props.task.id, this.props.task.column));
        deleteTaskFromColumn(this.props.task.id, store.state.user.uid);
    }

    handleDoubleClick = (event) => {
        event.target.contentEditable = true;
        event.target.focus();
    }

    handleBlur = async (event) => {
        event.target.contentEditable = false;
        const updatedText = event.target.textContent.trim();
        if (updatedText !== this.props.task.text) {
            const updatedTask = {
                ...this.props.task,
                text: updatedText,
            };
            store.dispatch(actions.updateTask(updatedTask));
            updateTaskText(updatedTask, store.state.user.uid);
        }
    }

    handleDragStart = (event) => {
        event.dataTransfer.setData('id', event.target.id);
        event.dataTransfer.setData('fromColumn', this.props.task.column);
        event.target.classList.add('dragging');
    }

    handleDragEnd = (event) => {
        event.target.classList.remove('dragging');
    }

    render() {
        const { task } = this.props;
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.id = task.id;
        taskEl.draggable = true;

        const taskTextEl = document.createElement('span');
        taskTextEl.className = 'task-text';
        taskTextEl.id = `task-text-${task.id}`;
        taskTextEl.textContent = task.text;
        taskTextEl.dataset.originalText = task.text;
        taskTextEl.addEventListener('dblclick', this.handleDoubleClick);
        taskTextEl.addEventListener('blur', this.handleBlur);

        const deleteBtnEl = document.createElement('button');
        deleteBtnEl.className = 'delete-btn';
        deleteBtnEl.id = `delete-${task.id}`;
        deleteBtnEl.textContent = 'X';
        deleteBtnEl.addEventListener('click', this.handleDelete);

        taskEl.appendChild(taskTextEl);
        taskEl.appendChild(deleteBtnEl);

        taskEl.addEventListener('dragstart', this.handleDragStart);
        taskEl.addEventListener('dragend', this.handleDragEnd);

        return taskEl;
    }
}

export default TaskComponent;